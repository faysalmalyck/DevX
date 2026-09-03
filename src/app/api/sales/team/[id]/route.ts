import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { authorizeSalesManagerTeam } from "@/lib/auth/sales-team-authorization";
import { hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { prisma } from "@/lib/db/prisma";
import { deriveTeamMemberProfileStatus } from "@/lib/team/profile-status";
import { revalidateTeamPaths } from "@/lib/team/revalidate";
import { serializeSalesTeamMember } from "@/lib/team/sales-serialization";
import { synchronizeTeamMemberSalesAccess, TeamSalesSyncError } from "@/lib/team/sales-sync";
import { teamMemberSalesSchema } from "@/lib/validations/team";

function json(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authorization = await authorizeSalesManagerTeam();
  if (!authorization.ok) return json({ error: authorization.error }, { status: authorization.status });
  if (!hasValidAdminCsrf(request)) return json({ error: "Invalid request token." }, { status: 403 });
  const { id } = await context.params;
  const parsed = teamMemberSalesSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ error: "Please correct the highlighted fields." }, { status: 400 });

  try {
    const existing = await prisma.teamMember.findFirst({ where: { id, deletedAt: null }, select: { id: true, slug: true, department: true, accessRole: true, salesRole: true, role: true, adminId: true } });
    if (!existing || existing.department !== "SALES") return json({ error: "Only Sales TeamMembers can be managed here." }, { status: 404 });
    if (parsed.data.department !== "SALES") return json({ error: "Sales TeamMembers must remain in the Sales department." }, { status: 422 });
    if (parsed.data.status === "PUBLISHED" && deriveTeamMemberProfileStatus(parsed.data) !== "COMPLETE") return json({ error: "Complete the BDE profile before publishing it." }, { status: 400 });
    if (existing.role === "Sales Manager" && parsed.data.accessRole !== "SALES_MANAGER") return json({ error: "A Sales Manager’s access cannot be changed here." }, { status: 403 });
    if (existing.role !== "Sales Manager" && (parsed.data.accessRole === "ADMINISTRATOR" || parsed.data.accessRole === "SALES_MANAGER")) return json({ error: "Sales Managers can only grant Business Development Executive access." }, { status: 403 });

    const nextAccessRole = existing.role === "Sales Manager" ? "SALES_MANAGER" : parsed.data.accessRole;
    const result = await prisma.$transaction(async (tx) => {
      const {
        accessRole,
        about: _about,
        aboutParagraph2: _aboutParagraph2,
        highlights: _highlights,
        experience: _experience,
        ...profile
      } = parsed.data;
      const member = await tx.teamMember.update({ where: { id }, data: { ...profile, department: "SALES", profileStatus: deriveTeamMemberProfileStatus(parsed.data), accessRole: nextAccessRole === "NONE" ? null : nextAccessRole, salesRole: nextAccessRole === "SALES_AGENT" ? "SALES_AGENT" : null } });
      if (existing.role !== "Sales Manager" && existing.adminId && (nextAccessRole === "SALES_AGENT" || nextAccessRole === "NONE")) {
        await synchronizeTeamMemberSalesAccess(tx, { actorId: authorization.session.id, teamMemberId: id, department: "SALES", accessRole: nextAccessRole, salesRole: nextAccessRole === "SALES_AGENT" ? "SALES_AGENT" : null, email: member.email, name: member.name, title: member.role });
      }
      await tx.auditLog.create({ data: { actorId: authorization.session.id, action: "SALES_TEAM_MEMBER_UPDATED", entity: "TeamMember", entityId: id, metadata: { accessRole: existing.accessRole } } });
      return member;
    });
    revalidateTeamPaths(existing.slug, result.slug);
    return json({ member: serializeSalesTeamMember(result) });
  } catch (error) {
    if (error instanceof TeamSalesSyncError) return json({ error: error.message }, { status: error.status });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return json({ error: "This Sales TeamMember email or username is already in use." }, { status: 409 });
    console.error("Sales Manager team update failed", error);
    return json({ error: "Unable to update this Sales TeamMember." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authorization = await authorizeSalesManagerTeam();
  if (!authorization.ok) return json({ error: authorization.error }, { status: authorization.status });
  if (!hasValidAdminCsrf(request)) return json({ error: "Invalid request token." }, { status: 403 });
  const { id } = await context.params;
  try {
    const existing = await prisma.teamMember.findFirst({ where: { id, deletedAt: null }, select: { id: true, slug: true, department: true, role: true, adminId: true, email: true, name: true } });
    if (!existing || existing.department !== "SALES") return json({ error: "Only Sales TeamMembers can be managed here." }, { status: 404 });
    if (existing.role === "Sales Manager") return json({ error: "Sales Managers cannot remove Sales Manager access." }, { status: 403 });
    await prisma.$transaction(async (tx) => {
      if (existing.adminId) await synchronizeTeamMemberSalesAccess(tx, { actorId: authorization.session.id, teamMemberId: id, department: "SALES", accessRole: "NONE", salesRole: null, email: existing.email, name: existing.name, title: existing.role });
      await tx.teamMember.update({ where: { id }, data: { deletedAt: new Date() } });
      await tx.auditLog.create({ data: { actorId: authorization.session.id, action: "SALES_TEAM_MEMBER_REMOVED", entity: "TeamMember", entityId: id, metadata: { adminId: existing.adminId } } });
    });
    revalidateTeamPaths(existing.slug);
    return json({ success: true });
  } catch (error) {
    if (error instanceof TeamSalesSyncError) return json({ error: error.message }, { status: error.status });
    return json({ error: "Unable to remove this Sales TeamMember." }, { status: 500 });
  }
}
