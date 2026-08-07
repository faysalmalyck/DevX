import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getActiveSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import type { PermissionAction } from "@/lib/permissions/rbac";
import { requirePermission } from "@/lib/permissions/rbac.server";
import { getResumeDownloadUrl } from "@/lib/storage/career-resumes";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const applicationIdSchema = z.string().trim().min(1).max(128);

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

export async function GET(_: NextRequest, { params }: RouteContext) {
  const authorization = await authorizeAdmin("VIEW");
  if (authorization instanceof NextResponse) return authorization;

  const { id } = await params;
  const parsedId = applicationIdSchema.safeParse(id);
  if (!parsedId.success) {
    return noStoreJson({ error: "Resume not found." }, { status: 404 });
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: parsedId.data },
      select: {
        resumeStorageKey: true,
        resumeOriginalFilename: true,
      },
    });

    if (!application) {
      return noStoreJson({ error: "Resume not found." }, { status: 404 });
    }

    const signedUrl = await getResumeDownloadUrl(
      application.resumeStorageKey,
      application.resumeOriginalFilename
    );
    const response = NextResponse.redirect(new URL(signedUrl), 307);
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("Vary", "Cookie");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  } catch {
    return noStoreJson(
      { error: "Unable to prepare the resume download right now." },
      { status: 500 }
    );
  }
}
