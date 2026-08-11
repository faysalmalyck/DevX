import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { authorizeAdmin, hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { prisma } from "@/lib/db/prisma";
import {
  deriveTeamMemberProfileStatus,
  getTeamMemberProfileFieldErrors,
} from "@/lib/team/profile-status";
import { serializeTeamMember } from "@/lib/team/types";
import { teamMemberSchema } from "@/lib/validations/team";
import { revalidateTeamPaths } from "../route";

type RouteContext = { params: Promise<{ id: string }> };

function validationErrorResponse(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const field = String(issue.path[0] ?? "form");
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }
  return NextResponse.json({ error: "Please correct the highlighted fields.", code: "VALIDATION_ERROR", fieldErrors }, { status: 400 });
}

function conflictResponse(target: "slug" | "email") {
  const label = target === "slug" ? "slug" : "email address";
  return NextResponse.json({ error: `A team member with this ${label} already exists.`, code: `${target.toUpperCase()}_CONFLICT`, fieldErrors: { [target]: [`This ${label} is already in use.`] } }, { status: 409 });
}

function incompletePublicationResponse(profile: Parameters<typeof getTeamMemberProfileFieldErrors>[0]) {
  const fieldErrors = getTeamMemberProfileFieldErrors(profile);
  fieldErrors.status = ["Complete the required profile fields before publishing this member."];
  return NextResponse.json({
    error: "Please complete the profile before publishing it.",
    code: "INCOMPLETE_PROFILE",
    fieldErrors,
  }, { status: 400 });
}

function duplicateField(error: Prisma.PrismaClientKnownRequestError): "slug" | "email" {
  const target = Array.isArray(error.meta?.target)
    ? error.meta.target.join(" ")
    : String(error.meta?.target ?? "");
  return target.toLowerCase().includes("email") ? "email" : "slug";
}

export async function GET(_: NextRequest, { params }: RouteContext) {
  const authorized = await authorizeAdmin("Team Members", "VIEW");
  if (!authorized.ok) return NextResponse.json({ error: "Access denied.", code: "ACCESS_DENIED" }, { status: authorized.status });
  const { id } = await params;
  try {
    const member = await prisma.teamMember.findFirst({ where: { id, deletedAt: null } });
    if (!member) return NextResponse.json({ error: "Team member not found.", code: "TEAM_MEMBER_NOT_FOUND" }, { status: 404 });
    return NextResponse.json({ data: serializeTeamMember(member) });
  } catch {
    return NextResponse.json({ error: "Unable to load this team member.", code: "TEAM_GET_FAILED" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const authorized = await authorizeAdmin("Team Members", "EDIT");
  if (!authorized.ok) return NextResponse.json({ error: "Access denied.", code: "ACCESS_DENIED" }, { status: authorized.status });
  if (!hasValidAdminCsrf(request)) return NextResponse.json({ error: "Invalid request token.", code: "CSRF_INVALID" }, { status: 403 });

  try {
    const { id } = await params;
    const parsed = teamMemberSchema.safeParse(await request.json() as unknown);
    if (!parsed.success) return validationErrorResponse(parsed.error.issues);
    const existing = await prisma.teamMember.findFirst({ where: { id, deletedAt: null } });
    if (!existing) return NextResponse.json({ error: "Team member not found.", code: "TEAM_MEMBER_NOT_FOUND" }, { status: 404 });
    const profileStatus = deriveTeamMemberProfileStatus(parsed.data);

    if (existing.status !== parsed.data.status) {
      const canPublish = await authorizeAdmin("Team Members", "PUBLISH");
      if (!canPublish.ok) return NextResponse.json({ error: "Access denied.", code: "ACCESS_DENIED" }, { status: canPublish.status });
    }
    if (parsed.data.status === "PUBLISHED" && profileStatus === "INCOMPLETE") {
      return incompletePublicationResponse(parsed.data);
    }

    const duplicateTargets = [
      ...(parsed.data.slug ? [{ slug: parsed.data.slug }] : []),
      ...(parsed.data.email ? [{ email: parsed.data.email }] : []),
    ];
    const duplicate = duplicateTargets.length > 0
      ? await prisma.teamMember.findFirst({
        where: { id: { not: id }, OR: duplicateTargets },
        select: { slug: true, email: true },
      })
      : null;
    if (duplicate?.slug === parsed.data.slug) return conflictResponse("slug");
    if (duplicate?.email === parsed.data.email) return conflictResponse("email");

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        ...parsed.data,
        profileStatus,
        legacyDepartment: parsed.data.department ? null : existing.legacyDepartment,
      },
    });
    await prisma.auditLog.create({ data: { actorId: authorized.session.id, action: "TEAM_MEMBER_UPDATED", entity: "TeamMember", entityId: id, metadata: { slug: member.slug } } });
    revalidateTeamPaths();
    return NextResponse.json({ data: serializeTeamMember(member) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return conflictResponse(duplicateField(error));
    }
    return NextResponse.json({ error: "Unable to update this team member.", code: "TEAM_UPDATE_FAILED" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const authorized = await authorizeAdmin("Team Members", "DELETE");
  if (!authorized.ok) return NextResponse.json({ error: "Access denied.", code: "ACCESS_DENIED" }, { status: authorized.status });
  if (!hasValidAdminCsrf(request)) return NextResponse.json({ error: "Invalid request token.", code: "CSRF_INVALID" }, { status: 403 });

  try {
    const { id } = await params;
    const member = await prisma.teamMember.findFirst({ where: { id, deletedAt: null } });
    if (!member) return NextResponse.json({ error: "Team member not found.", code: "TEAM_MEMBER_NOT_FOUND" }, { status: 404 });
    await prisma.teamMember.update({ where: { id }, data: { deletedAt: new Date() } });
    await prisma.auditLog.create({ data: { actorId: authorized.session.id, action: "TEAM_MEMBER_DELETED", entity: "TeamMember", entityId: id, metadata: { slug: member.slug } } });
    revalidateTeamPaths();
    return NextResponse.json({ data: { id, deleted: true } });
  } catch {
    return NextResponse.json({ error: "Unable to delete this team member.", code: "TEAM_DELETE_FAILED" }, { status: 500 });
  }
}
