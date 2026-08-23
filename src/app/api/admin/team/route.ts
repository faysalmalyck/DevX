import { Prisma, TeamMemberStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { authorizeAdmin, hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { prisma } from "@/lib/db/prisma";
import {
  deriveTeamMemberProfileStatus,
  getTeamMemberProfileFieldErrors,
} from "@/lib/team/profile-status";
import { serializeTeamMember } from "@/lib/team/types";
import { teamMemberSchema } from "@/lib/validations/team";
import { synchronizeTeamMemberSalesAccess, TeamSalesSyncError } from "@/lib/team/sales-sync";
import { revalidateTeamPaths } from "@/lib/team/revalidate";

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

export async function GET() {
  const authorized = await authorizeAdmin("Team Members", "VIEW");
  if (!authorized.ok) return NextResponse.json({ error: "Access denied.", code: "ACCESS_DENIED" }, { status: authorized.status });

  try {
    const members = await prisma.teamMember.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ data: members.map(serializeTeamMember) });
  } catch {
    return NextResponse.json({ error: "Unable to load team members.", code: "TEAM_LIST_FAILED" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authorized = await authorizeAdmin("Team Members", "CREATE");
  if (!authorized.ok) return NextResponse.json({ error: "Access denied.", code: "ACCESS_DENIED" }, { status: authorized.status });
  if (!hasValidAdminCsrf(request)) return NextResponse.json({ error: "Invalid request token.", code: "CSRF_INVALID" }, { status: 403 });

  try {
    const parsed = teamMemberSchema.safeParse(await request.json() as unknown);
    if (!parsed.success) return validationErrorResponse(parsed.error.issues);

    const profileStatus = deriveTeamMemberProfileStatus(parsed.data);

    if (parsed.data.status === TeamMemberStatus.PUBLISHED) {
      const canPublish = await authorizeAdmin("Team Members", "PUBLISH");
      if (!canPublish.ok) return NextResponse.json({ error: "Access denied.", code: "ACCESS_DENIED" }, { status: canPublish.status });
      if (profileStatus === "INCOMPLETE") return incompletePublicationResponse(parsed.data);
    }

    const duplicateTargets = [
      ...(parsed.data.slug ? [{ slug: parsed.data.slug }] : []),
      ...(parsed.data.email ? [{ email: parsed.data.email }] : []),
    ];
    const existing = duplicateTargets.length > 0
      ? await prisma.teamMember.findFirst({
        where: { OR: duplicateTargets },
        select: { slug: true, email: true },
      })
      : null;
    if (existing?.slug === parsed.data.slug) return conflictResponse("slug");
    if (existing?.email === parsed.data.email) return conflictResponse("email");

    const { member, salesAccess } = await prisma.$transaction(async (tx) => {
      const { accessRole, ...teamMemberData } = parsed.data;
      const member = await tx.teamMember.create({
        data: { ...teamMemberData, accessRole: accessRole === "NONE" ? null : accessRole, profileStatus },
      });
      const salesAccess = await synchronizeTeamMemberSalesAccess(tx, {
        actorId: authorized.session.id,
        teamMemberId: member.id,
        department: member.department,
        accessRole: parsed.data.accessRole,
        salesRole: member.salesRole,
        email: member.email,
        name: member.name,
        title: member.role,
      });
      await tx.auditLog.create({ data: { actorId: authorized.session.id, action: "TEAM_MEMBER_CREATED", entity: "TeamMember", entityId: member.id, metadata: { slug: member.slug, salesRole: member.salesRole ?? null } } });
      return { member, salesAccess };
    });
    revalidateTeamPaths();
    return NextResponse.json({
      data: serializeTeamMember(member),
      salesAccess: salesAccess.activationToken
        ? { status: salesAccess.action, activationUrl: new URL(`/reset-password?token=${encodeURIComponent(salesAccess.activationToken)}`, request.url).toString() }
        : { status: salesAccess.action },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof TeamSalesSyncError) {
      return NextResponse.json({ error: error.message, code: "SALES_SYNC_FAILED" }, { status: error.status });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return conflictResponse(duplicateField(error));
    }
    return NextResponse.json({ error: "Unable to create this team member.", code: "TEAM_CREATE_FAILED" }, { status: 500 });
  }
}
