import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authorizeLead } from "@/lib/auth/lead-authorization";
import { prisma } from "@/lib/db/prisma";

const querySchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
  filter: z.enum(["today", "overdue", "upcoming", "completed"]).optional(),
  leadId: z.string().trim().min(1).max(128).optional(),
  assignedAgentId: z.string().trim().min(1).max(128).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().min(1).max(100000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(30),
});

function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

function startOfUtcDay(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function addUtcDays(value: Date, days: number) {
  const result = new Date(value);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function parseUtcDay(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);
  const result = new Date(Date.UTC(year, month - 1, day));
  return result.getUTCFullYear() === year && result.getUTCMonth() === month - 1 && result.getUTCDate() === day ? result : null;
}

export async function GET(request: NextRequest) {
  const view = request.nextUrl.searchParams.get("view");
  const authorization = await authorizeLead("VIEW", undefined, view === "my" || view === "team" ? { view } : undefined);
  if (!authorization.ok) {
    return noStoreJson({ error: authorization.status === 401 ? "Authentication is required." : "You do not have access to follow-ups." }, { status: authorization.status });
  }

  const parsed = querySchema.safeParse({
    status: request.nextUrl.searchParams.get("status") ?? undefined,
    filter: request.nextUrl.searchParams.get("filter") ?? undefined,
    leadId: request.nextUrl.searchParams.get("leadId") ?? undefined,
    assignedAgentId: request.nextUrl.searchParams.get("assignedAgentId") ?? undefined,
    from: request.nextUrl.searchParams.get("from") ?? undefined,
    to: request.nextUrl.searchParams.get("to") ?? undefined,
    page: request.nextUrl.searchParams.get("page") ?? undefined,
    pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
  });
  if (!parsed.success) return noStoreJson({ error: "Invalid follow-up filters." }, { status: 400 });
  const query = parsed.data;
  if (authorization.scope === "OWN" && query.assignedAgentId && query.assignedAgentId !== authorization.session.id) {
    return noStoreJson({ error: "You can only view your assigned follow-ups." }, { status: 403 });
  }

  const from = query.from ? parseUtcDay(query.from) : null;
  const inclusiveTo = query.to ? parseUtcDay(query.to) : null;
  if ((query.from && !from) || (query.to && !inclusiveTo) || (from && inclusiveTo && inclusiveTo < from)) {
    return noStoreJson({ error: "Invalid follow-up date range." }, { status: 400 });
  }

  const now = new Date();
  const today = startOfUtcDay(now);
  const tomorrow = addUtcDays(today, 1);
  const derivedFilter = query.filter === "completed"
    ? { status: "COMPLETED" as const }
    : query.filter === "today"
      ? { status: "PENDING" as const, dueAt: { gte: today, lt: tomorrow } }
      : query.filter === "overdue"
        ? { status: "PENDING" as const, dueAt: { lt: today } }
        : query.filter === "upcoming"
          ? { status: "PENDING" as const, dueAt: { gte: tomorrow } }
          : {};
  const leadWhere = {
    deletedAt: null,
    ...(authorization.scope === "OWN" ? { assignedAgentId: authorization.session.id } : {}),
    ...(authorization.scope === "ALL" && query.assignedAgentId ? { assignedAgentId: query.assignedAgentId } : {}),
  };
  const where = {
    deletedAt: null,
    lead: leadWhere,
    ...(query.status ? { status: query.status } : {}),
    ...derivedFilter,
    ...(query.leadId ? { leadId: query.leadId } : {}),
    ...(from || inclusiveTo
      ? { dueAt: { ...(from ? { gte: from } : {}), ...(inclusiveTo ? { lt: addUtcDays(inclusiveTo, 1) } : {}) } }
      : {}),
  };

  try {
    const total = await prisma.leadFollowUp.count({ where });
    const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
    const page = Math.min(pageCount, query.page);
    const followUps = await prisma.leadFollowUp.findMany({
      where,
      orderBy: [{ dueAt: "asc" }, { id: "asc" }],
      skip: (page - 1) * query.pageSize,
      take: query.pageSize,
      include: {
        lead: { select: { id: true, fullName: true, company: true, status: true } },
        assignedAgent: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    return noStoreJson({
      followUps: followUps.map((followUp) => ({
        ...followUp,
        dueAt: followUp.dueAt.toISOString(),
        completedAt: followUp.completedAt?.toISOString() ?? null,
        createdAt: followUp.createdAt.toISOString(),
        updatedAt: followUp.updatedAt.toISOString(),
        assignedAgent: { id: followUp.assignedAgent.id, name: `${followUp.assignedAgent.firstName} ${followUp.assignedAgent.lastName}`.trim() },
      })),
      pagination: { page, pageSize: query.pageSize, total, pageCount },
      scope: authorization.scope,
    });
  } catch (error) {
    console.error("Follow-up list load failed", error);
    return noStoreJson({ error: "Unable to load follow-ups right now." }, { status: 500 });
  }
}
