import { Prisma, TeamMemberStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";

import { authorizeSalesManagerTeam } from "@/lib/auth/sales-team-authorization";
import { hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { hashPassword } from "@/lib/auth/hash";
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

function validation(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }
  return json({ error: "Please correct the highlighted fields.", fieldErrors }, { status: 400 });
}

function salesOnly(data: z.infer<typeof teamMemberSalesSchema>) {
  return data.department === "SALES" && data.role === "Business Development Executive" && data.accessRole === "SALES_AGENT" && data.salesRole === "SALES_AGENT";
}

export async function GET() {
  const authorization = await authorizeSalesManagerTeam();
  if (!authorization.ok) return json({ error: authorization.error }, { status: authorization.status });
  try {
    const members = await prisma.teamMember.findMany({
      where: { deletedAt: null, department: "SALES" },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      include: { admin: { select: { id: true, email: true, username: true, status: true, lastLogin: true, role: { select: { name: true } } } } },
    });
    return json({ members: members.map((member) => ({ ...serializeSalesTeamMember(member), admin: member.admin ? { ...member.admin, lastLogin: member.admin.lastLogin?.toISOString() ?? null } : null })) });
  } catch (error) {
    console.error("Sales Manager team list failed", error);
    return json({ error: "Unable to load the Sales team right now." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeSalesManagerTeam();
  if (!authorization.ok) return json({ error: authorization.error }, { status: authorization.status });
  if (!hasValidAdminCsrf(request)) return json({ error: "Invalid request token." }, { status: 403 });

  const parsed = teamMemberSalesSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validation(parsed.error);
  if (!salesOnly(parsed.data)) return json({ error: "Sales Managers can only create Business Development Executive access." }, { status: 403 });
  if (deriveTeamMemberProfileStatus(parsed.data) !== "COMPLETE") return json({ error: "Complete the BDE profile, including a biography of at least 10 characters, before publishing it." }, { status: 400 });

  const temporaryPassword = `DevX-${randomBytes(18).toString("base64url")}`;
  const temporaryPasswordHash = await hashPassword(temporaryPassword);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const {
        accessRole,
        about: _about,
        aboutParagraph2: _aboutParagraph2,
        highlights: _highlights,
        experience: _experience,
        ...profile
      } = parsed.data;
      const member = await tx.teamMember.create({ data: { ...profile, department: "SALES", role: "Business Development Executive", status: TeamMemberStatus.PUBLISHED, profileStatus: deriveTeamMemberProfileStatus(parsed.data), accessRole: "SALES_AGENT", salesRole: "SALES_AGENT" } });
      const access = await synchronizeTeamMemberSalesAccess(tx, { actorId: authorization.session.id, teamMemberId: member.id, department: member.department, accessRole: "SALES_AGENT", salesRole: "SALES_AGENT", email: member.email, name: member.name, title: member.role, temporaryPassword, temporaryPasswordHash });
      await tx.auditLog.create({ data: { actorId: authorization.session.id, action: "SALES_TEAM_MEMBER_CREATED", entity: "TeamMember", entityId: member.id, metadata: { accessRole: "SALES_AGENT", adminId: access.adminId } } });
      return { member, access };
    }, { maxWait: 5000, timeout: 15000 });
    revalidateTeamPaths(result.member.slug);
    return json({ success: true, member: serializeSalesTeamMember(result.member), credentials: result.access.temporaryPassword && result.access.username ? { email: result.member.email, username: result.access.username, temporaryPassword: result.access.temporaryPassword, adminLoginUrl: new URL("/login?portal=admin", request.url).toString(), salesLoginUrl: new URL("/login?portal=sales", request.url).toString() } : null }, { status: 201 });
  } catch (error) {
    if (error instanceof TeamSalesSyncError) return json({ error: error.message }, { status: error.status });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return json({ error: "This Sales TeamMember email or username is already in use." }, { status: 409 });
    console.error("Sales Manager team create failed", error);
    return json({ error: "Unable to create this Business Development Executive." }, { status: 500 });
  }
}
