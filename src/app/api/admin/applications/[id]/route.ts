import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getActiveSession } from "@/lib/auth/session";
import { hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { prisma } from "@/lib/db/prisma";
import type { PermissionAction } from "@/lib/permissions/rbac";
import { requirePermission } from "@/lib/permissions/rbac.server";
import {
  tryDeleteCareerResume,
} from "@/lib/storage/career-resume-cleanup";

const applicationStatuses = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "REJECTED",
  "HIRED",
  "WITHDRAWN",
] as const;

const applicationIdSchema = z.string().trim().min(1).max(128);

const updateApplicationSchema = z
  .object({
    status: z.enum(applicationStatuses).optional(),
    internalNotes: z.string().max(10000).nullable().optional(),
  })
  .strict()
  .refine(
    (value) => value.status !== undefined || value.internalNotes !== undefined,
    { message: "At least one change is required." }
  );

interface RouteContext {
  params: Promise<{ id: string }>;
}

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

function serializeApplication(application: {
  id: string;
  careerId: string;
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  yearsOfExperience: number;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  coverLetter: string;
  resumeOriginalFilename: string;
  resumeMimeType: string;
  resumeSize: number;
  consentConfirmed: boolean;
  status: (typeof applicationStatuses)[number];
  internalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  career: { id: string; title: string; slug: string };
}) {
  return {
    ...application,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
  };
}

const applicationSelect = {
  id: true,
  careerId: true,
  fullName: true,
  email: true,
  phone: true,
  currentLocation: true,
  yearsOfExperience: true,
  linkedinUrl: true,
  portfolioUrl: true,
  coverLetter: true,
  resumeOriginalFilename: true,
  resumeMimeType: true,
  resumeSize: true,
  consentConfirmed: true,
  status: true,
  internalNotes: true,
  createdAt: true,
  updatedAt: true,
  career: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
} as const;

async function parsedId(params: RouteContext["params"]): Promise<string | null> {
  const { id } = await params;
  const parsed = applicationIdSchema.safeParse(id);
  return parsed.success ? parsed.data : null;
}

export async function GET(_: NextRequest, { params }: RouteContext) {
  const authorization = await authorizeAdmin("VIEW");
  if (authorization instanceof NextResponse) return authorization;

  const id = await parsedId(params);
  if (!id) {
    return noStoreJson({ error: "Application not found." }, { status: 404 });
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id },
      select: applicationSelect,
    });

    if (!application) {
      return noStoreJson({ error: "Application not found." }, { status: 404 });
    }

    return noStoreJson({ application: serializeApplication(application) });
  } catch {
    return noStoreJson(
      { error: "Unable to load this application right now." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const authorization = await authorizeAdmin("EDIT");
  if (authorization instanceof NextResponse) return authorization;

  if (!hasValidAdminCsrf(request)) {
    return noStoreJson({ error: "Invalid request token." }, { status: 403 });
  }

  const id = await parsedId(params);
  if (!id) {
    return noStoreJson({ error: "Application not found." }, { status: 404 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsedBody = updateApplicationSchema.safeParse(body);

  if (!parsedBody.success) {
    return noStoreJson({ error: "Invalid application update." }, { status: 400 });
  }

  const updateData = {
    ...(parsedBody.data.status !== undefined
      ? { status: parsedBody.data.status }
      : {}),
    ...(parsedBody.data.internalNotes !== undefined
      ? {
          internalNotes:
            parsedBody.data.internalNotes?.trim() || null,
        }
      : {}),
  };

  try {
    const application = await prisma.application.update({
      where: { id },
      data: updateData,
      select: applicationSelect,
    });

    revalidatePath("/admin/applications");

    return noStoreJson({ application: serializeApplication(application) });
  } catch {
    return noStoreJson(
      { error: "Unable to save the application review." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const authorization = await authorizeAdmin("DELETE");
  if (authorization instanceof NextResponse) return authorization;

  if (!hasValidAdminCsrf(request)) {
    return noStoreJson({ error: "Invalid request token." }, { status: 403 });
  }

  const id = await parsedId(params);
  if (!id) {
    return noStoreJson({ error: "Application not found." }, { status: 404 });
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        resumeStorageKey: true,
      },
    });

    if (!application) {
      return noStoreJson({ error: "Application not found." }, { status: 404 });
    }

    // Delete the database record and persist a cleanup intent together. This
    // prevents a database failure from removing a resume while retaining its
    // application record, and a cron retry handles a transient Storage error.
    await prisma.$transaction(async (tx) => {
      await tx.application.delete({ where: { id } });
      await tx.resumeCleanup.upsert({
        where: { storageKey: application.resumeStorageKey },
        create: {
          storageKey: application.resumeStorageKey,
          nextAttemptAt: new Date(),
        },
        update: {
          nextAttemptAt: new Date(),
        },
      });
    });

    const resumeDeleted = await tryDeleteCareerResume(
      application.resumeStorageKey
    );
    if (resumeDeleted) {
      await prisma.resumeCleanup.deleteMany({
        where: { storageKey: application.resumeStorageKey },
      });
    }
    revalidatePath("/admin/applications");

    return noStoreJson({ success: true, resumeCleanupPending: !resumeDeleted });
  } catch {
    return noStoreJson(
      { error: "Unable to delete this application right now." },
      { status: 500 }
    );
  }
}
