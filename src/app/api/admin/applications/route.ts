import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getActiveSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  requirePermission,
} from "@/lib/permissions/rbac.server";
import type { PermissionAction } from "@/lib/permissions/rbac";

const applicationStatuses = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "REJECTED",
  "HIRED",
  "WITHDRAWN",
] as const;

const listQuerySchema = z.object({
  q: z.string().trim().max(120).default(""),
  careerId: z.string().trim().min(1).max(128).optional(),
  status: z.enum(applicationStatuses).optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  page: z.coerce.number().int().min(1).max(100000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");

  return NextResponse.json(data, { ...init, headers });
}

async function authorizeAdmin(
  action: PermissionAction
): Promise<string | NextResponse> {
  const session = await getActiveSession();

  if (!session || session.userType !== "admin") {
    return noStoreJson({ error: "Authentication is required." }, { status: 401 });
  }

  const allowed = await requirePermission("Applications", action);
  if (!allowed) {
    return noStoreJson({ error: "You do not have access to applications." }, { status: 403 });
  }

  return session.id;
}

function applicationStats(
  statusCounts: Array<{ status: (typeof applicationStatuses)[number]; _count: { _all: number } }>,
  total: number
) {
  const stats = {
    total,
    new: 0,
    reviewing: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
    rejected: 0,
  };

  for (const statusCount of statusCounts) {
    switch (statusCount.status) {
      case "NEW":
        stats.new = statusCount._count._all;
        break;
      case "REVIEWING":
        stats.reviewing = statusCount._count._all;
        break;
      case "SHORTLISTED":
        stats.shortlisted = statusCount._count._all;
        break;
      case "INTERVIEW":
        stats.interview = statusCount._count._all;
        break;
      case "HIRED":
        stats.hired = statusCount._count._all;
        break;
      case "REJECTED":
        stats.rejected = statusCount._count._all;
        break;
      case "WITHDRAWN":
        break;
    }
  }

  return stats;
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeAdmin("VIEW");
  if (authorization instanceof NextResponse) return authorization;

  const queryResult = listQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get("q") ?? "",
    careerId: request.nextUrl.searchParams.get("careerId") || undefined,
    status: request.nextUrl.searchParams.get("status") || undefined,
    sort: request.nextUrl.searchParams.get("sort") || undefined,
    page: request.nextUrl.searchParams.get("page") || undefined,
    pageSize: request.nextUrl.searchParams.get("pageSize") || undefined,
  });

  if (!queryResult.success) {
    return noStoreJson({ error: "Invalid application filters." }, { status: 400 });
  }

  const query = queryResult.data;
  const where = {
    ...(query.careerId ? { careerId: query.careerId } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(query.q
      ? {
          OR: [
            {
              fullName: {
                contains: query.q,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: query.q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  try {
    const [filteredTotal, allTotal, statusCounts] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.count(),
      prisma.application.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);
    const pageCount = Math.max(1, Math.ceil(filteredTotal / query.pageSize));
    const resolvedPage = Math.min(query.page, pageCount);
    const applications = await prisma.application.findMany({
      where,
      select: {
        id: true,
        careerId: true,
        fullName: true,
        email: true,
        phone: true,
        yearsOfExperience: true,
        resumeOriginalFilename: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        career: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: query.sort === "oldest" ? "asc" : "desc",
      },
      skip: (resolvedPage - 1) * query.pageSize,
      take: query.pageSize,
    });

    return noStoreJson({
      applications: applications.map((application) => ({
        ...application,
        createdAt: application.createdAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
      })),
      pagination: {
        page: resolvedPage,
        pageSize: query.pageSize,
        total: filteredTotal,
        pageCount,
      },
      stats: applicationStats(statusCounts, allTotal),
    });
  } catch {
    return noStoreJson(
      { error: "Unable to load applications right now." },
      { status: 500 }
    );
  }
}
