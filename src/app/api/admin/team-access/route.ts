import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { randomBytes } from "node:crypto";
import { z } from "zod";

import { authorizeAdmin, hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/hash";
import { getTeamAccessDisplayRole } from "@/lib/team/access";
import { synchronizeTeamMemberSalesAccess, TeamSalesSyncError } from "@/lib/team/sales-sync";

const accessRoleSchema = z.enum(["NONE", "ADMINISTRATOR", "SALES_MANAGER", "SALES_AGENT"]);
const mutationSchema = z.object({
  teamMemberId: z.string().trim().min(1).max(128),
  accessRole: accessRoleSchema,
}).strict();

function noStoreJson(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

function unexpectedUpdateError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "This email, username, agent code, or TeamMember is already in use.";
    }
    if (error.code === "P2003") {
      return "The linked Admin role or TeamMember record is no longer available. Refresh and try again.";
    }
    if (error.code === "P2025") {
      return "The TeamMember or Admin record changed while you were saving. Refresh and try again.";
    }
  }

  return "Team Access could not be saved because the server rejected the change. Refresh and try again.";
}

export async function GET() {
  const authorized = await authorizeAdmin("Team Members", "VIEW");
  if (!authorized.ok) return noStoreJson({ error: "Only an authorized Admin can view Team Access. Sign in with Faysal’s CEO/Super Admin account." }, { status: authorized.status });

  try {
    const members = await prisma.teamMember.findMany({
      where: { deletedAt: null },
      orderBy: [{ name: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        role: true,
        department: true,
        email: true,
        accessRole: true,
        salesRole: true,
        admin: {
          select: {
            id: true,
            email: true,
            status: true,
            lastLogin: true,
            agentCode: true,
            role: { select: { name: true, isSuperAdmin: true } },
          },
        },
      },
    });

    return noStoreJson({
      members: members.map((member) => ({
        ...member,
        accessRole: getTeamAccessDisplayRole(member),
        lastLogin: member.admin?.lastLogin?.toISOString() ?? null,
      })),
    });
  } catch (error) {
    console.error("Team access list failed", error);
    return noStoreJson({ error: "Unable to load Team Access right now." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authorized = await authorizeAdmin("Team Members", "EDIT");
  if (!authorized.ok) return noStoreJson({ error: "Only an authorized Admin can change Team Access. Sign in with Faysal’s CEO/Super Admin account." }, { status: authorized.status });
  if (!hasValidAdminCsrf(request)) return noStoreJson({ error: "Invalid request token." }, { status: 403 });

  const parsed = mutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Choose a valid TeamMember and access role." }, { status: 400 });

  try {
    const temporaryPassword = parsed.data.accessRole === "NONE"
      ? null
      : `DevX-${randomBytes(18).toString("base64url")}`;
    const temporaryPasswordHash = temporaryPassword ? await hashPassword(temporaryPassword) : null;

    // Invited Sales identities are provisioned inside this transaction and
    // password hashing is intentionally expensive. Use a longer transaction
    // window so the account, TeamMember link, and audit records commit
    // atomically instead of expiring mid-save.
    const result = await prisma.$transaction(async (tx) => {
      const member = await tx.teamMember.findFirst({ where: { id: parsed.data.teamMemberId, deletedAt: null } });
      if (!member) throw new TeamSalesSyncError("TeamMember not found.", 404);

      const salesRole = parsed.data.accessRole === "SALES_MANAGER"
        ? "SALES_MANAGER"
        : parsed.data.accessRole === "SALES_AGENT"
          ? "SALES_AGENT"
          : null;
      const wantsSales = salesRole !== null;
      const updated = await tx.teamMember.update({
        where: { id: member.id },
        data: {
          accessRole: parsed.data.accessRole === "NONE" ? null : parsed.data.accessRole,
          salesRole,
          ...(wantsSales ? { department: "SALES" } : {}),
          ...(parsed.data.accessRole === "SALES_AGENT" ? { role: "Business Development Executive" } : {}),
          ...(parsed.data.accessRole === "SALES_MANAGER" ? { role: "Sales Manager" } : {}),
        },
      });

      const access = await synchronizeTeamMemberSalesAccess(tx, {
        actorId: authorized.session.id,
        teamMemberId: updated.id,
        department: updated.department,
        accessRole: parsed.data.accessRole,
        salesRole: updated.salesRole,
        email: updated.email,
        name: updated.name,
        title: updated.role,
        temporaryPassword: temporaryPassword ?? undefined,
        temporaryPasswordHash: temporaryPasswordHash ?? undefined,
      });

      await tx.auditLog.create({
        data: {
          actorId: authorized.session.id,
          action: "TEAM_ACCESS_CHANGED",
          entity: "TeamMember",
          entityId: updated.id,
          metadata: { accessRole: parsed.data.accessRole, adminId: access.adminId },
        },
      });

      return { access, member: updated };
    }, { maxWait: 5_000, timeout: 15_000 });

    return noStoreJson({
      success: true,
      accessRole: parsed.data.accessRole,
      adminId: result.access.adminId,
      status: result.access.action,
      credentials: result.access.temporaryPassword && result.access.username
        ? {
          email: result.member.email,
          username: result.access.username,
          temporaryPassword: result.access.temporaryPassword,
          adminLoginUrl: new URL("/login?portal=admin", request.url).toString(),
          salesLoginUrl: result.access.role === "Sales Manager" || result.access.role === "Sales Agent"
            ? new URL("/login?portal=sales", request.url).toString()
            : null,
        }
        : null,
    });
  } catch (error) {
    if (error instanceof TeamSalesSyncError) return noStoreJson({ error: error.message }, { status: error.status });
    const requestId = randomUUID();
    console.error("Team access update failed", { requestId, error });
    return noStoreJson({ error: unexpectedUpdateError(error), requestId }, { status: 500 });
  }
}
