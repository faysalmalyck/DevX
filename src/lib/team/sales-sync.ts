import { Prisma, type SalesTeamRole } from "@prisma/client";
import { randomBytes } from "node:crypto";

import { hashPassword } from "@/lib/auth/hash";
import { revokeAdminSessions } from "@/lib/auth/session";
import { hashToken } from "@/lib/auth/csrf";
import { generateUniqueAgentCode } from "@/lib/sales/agent-codes";
import { SALES_AGENT_ROLE_NAME, SALES_MANAGER_ROLE_NAME } from "@/lib/sales/agents";
import { isProtectedTeamAdmin } from "@/lib/team/access";

export class TeamSalesSyncError extends Error {
  constructor(message: string, readonly status: 400 | 403 | 404 | 409 | 422) {
    super(message);
    this.name = "TeamSalesSyncError";
  }
}

export type ManagedAccessRole = "NONE" | "ADMINISTRATOR" | "SALES_MANAGER" | "SALES_AGENT";

type SalesSyncInput = {
  actorId: string;
  teamMemberId: string;
  department: string | null;
  accessRole?: ManagedAccessRole | null;
  salesRole: SalesTeamRole | null;
  email: string | null;
  name: string | null;
  title: string | null;
  temporaryPassword?: string;
  temporaryPasswordHash?: string;
};

const SALES_ROLE_NAMES = [SALES_AGENT_ROLE_NAME, SALES_MANAGER_ROLE_NAME] as const;

function roleNameForSalesRole(role: "SALES_MANAGER" | "SALES_AGENT") {
  return role === "SALES_MANAGER" ? SALES_MANAGER_ROLE_NAME : SALES_AGENT_ROLE_NAME;
}

function isProtectedRole(roleName: string) {
  return roleName === "CEO" || roleName === "Administrator" || roleName === SALES_MANAGER_ROLE_NAME;
}

function splitName(name: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "Team", lastName: parts.slice(1).join(" ") || "Member" };
}

async function uniqueUsername(tx: Prisma.TransactionClient, email: string) {
  const base = email.split("@")[0]?.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 64) || "team-member";
  let candidate = base;
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const exists = await tx.admin.findUnique({ where: { username: candidate }, select: { id: true } });
    if (!exists) return candidate;
    candidate = `${base.slice(0, 54)}-${attempt}`;
  }
  throw new TeamSalesSyncError("Unable to allocate a unique account username.", 409);
}

function normalizedAccessRole(input: SalesSyncInput): ManagedAccessRole {
  if (input.accessRole) return input.accessRole;
  if (input.salesRole === "SALES_MANAGER") return "SALES_MANAGER";
  if (input.salesRole === "SALES_AGENT") return "SALES_AGENT";
  return "NONE";
}

/** Synchronizes one TeamMember's controlled access choice and linked Admin identity. */
export async function synchronizeTeamMemberSalesAccess(tx: Prisma.TransactionClient, input: SalesSyncInput) {
  const member = await tx.teamMember.findFirst({ where: { id: input.teamMemberId, deletedAt: null }, select: { id: true, adminId: true } });
  if (!member) throw new TeamSalesSyncError("Team member not found.", 404);

  const actor = await tx.admin.findUnique({ where: { id: input.actorId, deletedAt: null }, select: { role: { select: { name: true, isSuperAdmin: true } } } });
  if (!actor) throw new TeamSalesSyncError("Active administrator context is required.", 403);
  const actorIsSuperAdmin = actor.role.isSuperAdmin || actor.role.name === "CEO";
  const accessRole = normalizedAccessRole(input);
  const wantsSales = accessRole === "SALES_MANAGER" || accessRole === "SALES_AGENT";

  if (wantsSales && input.department !== "SALES") throw new TeamSalesSyncError("Sales access requires the Sales department.", 422);
  if (accessRole === "SALES_AGENT" && input.title !== "Business Development Executive") throw new TeamSalesSyncError("Sales Agent access requires the Business Development Executive title.", 422);
  if (accessRole === "SALES_MANAGER" && input.title !== "Sales Manager") throw new TeamSalesSyncError("Sales Manager access requires the Sales Manager title.", 422);
  if (accessRole === "SALES_MANAGER" && !actorIsSuperAdmin) throw new TeamSalesSyncError("Only Super Admin governance can appoint the Sales Manager.", 403);
  if (accessRole === "ADMINISTRATOR" && !actorIsSuperAdmin) throw new TeamSalesSyncError("Only Super Admin governance can grant Administrator access.", 403);

  if (accessRole === "NONE") {
    if (!member.adminId) return { action: "unchanged", adminId: null } as const;
    const linked = await tx.admin.findUnique({ where: { id: member.adminId }, select: { id: true, role: { select: { name: true, isSuperAdmin: true } } } });
    if (!linked) {
      await tx.teamMember.update({ where: { id: member.id }, data: { adminId: null, accessRole: null, salesRole: null } });
      return { action: "unlinked", adminId: null } as const;
    }
    if (isProtectedTeamAdmin(linked.role)) {
      throw new TeamSalesSyncError("The protected CEO account cannot be removed through Team Access.", 403);
    }
    if (SALES_ROLE_NAMES.includes(linked.role.name as (typeof SALES_ROLE_NAMES)[number])) {
      const [openWork, pendingFollowUps] = await Promise.all([
        tx.lead.count({ where: { assignedAgentId: linked.id, deletedAt: null, status: { notIn: ["WON", "LOST", "DUPLICATE"] } } }),
        tx.leadFollowUp.count({ where: { assignedAgentId: linked.id, deletedAt: null, status: "PENDING" } }),
      ]);
      if (openWork > 0 || pendingFollowUps > 0) throw new TeamSalesSyncError("Reassign active Sales work before removing access from this TeamMember.", 422);
    }
    await revokeAdminSessions(linked.id, tx);
    await tx.admin.update({ where: { id: linked.id }, data: { status: "SUSPENDED", deletedAt: null } });
    await tx.teamMember.update({ where: { id: member.id }, data: { adminId: null, accessRole: null, salesRole: null } });
    await Promise.all([
      tx.adminActivity.create({ data: { adminId: linked.id, action: "TEAM_ACCESS_REMOVED", module: "Team Members", description: "Login access was removed through TeamMember governance." } }),
      tx.auditLog.create({ data: { actorId: input.actorId, action: "TEAM_ACCESS_REMOVED", entity: "TeamMember", entityId: member.id, metadata: { adminId: linked.id } } }),
    ]);
    return { action: "removed", adminId: linked.id } as const;
  }

  if (!input.email) throw new TeamSalesSyncError("Email is required for account access.", 422);
  if (wantsSales && input.salesRole !== accessRole) throw new TeamSalesSyncError("Sales Role must match the selected access role.", 422);
  const normalizedEmail = input.email.trim().toLowerCase();
  const targetRoleName = accessRole === "ADMINISTRATOR" ? "Administrator" : roleNameForSalesRole(accessRole);
  const existingAdmin = await tx.admin.findFirst({ where: { email: { equals: normalizedEmail, mode: "insensitive" }, deletedAt: null }, select: { id: true, username: true, roleId: true, agentCode: true, status: true, role: { select: { id: true, name: true, isSuperAdmin: true } } } });

  let activationToken: string | null = null;
  if (!existingAdmin) {
    const role = await tx.role.findUnique({ where: { name: targetRoleName }, select: { id: true } });
    if (!role) throw new TeamSalesSyncError("The selected Admin role is not initialized.", 422);
    const names = splitName(input.name);
    const username = await uniqueUsername(tx, normalizedEmail);
    activationToken = randomBytes(32).toString("base64url");
    const temporaryPassword = input.temporaryPassword ?? `DevX-${randomBytes(18).toString("base64url")}`;
    const temporaryPasswordHash = input.temporaryPasswordHash ?? await hashPassword(temporaryPassword);
    const agentCode = wantsSales ? await generateUniqueAgentCode(names.firstName, names.lastName, async (candidate) => Boolean(await tx.admin.findUnique({ where: { agentCode: candidate }, select: { id: true } }))) : null;
    const account = await tx.admin.create({ data: { firstName: names.firstName, lastName: names.lastName, email: normalizedEmail, username, password: temporaryPasswordHash, roleId: role.id, status: "ACTIVE", requirePasswordChange: true, passwordResetToken: hashToken(activationToken), passwordResetExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), agentCode }, select: { id: true, username: true, role: { select: { name: true } } } });
    await tx.teamMember.update({ where: { id: member.id }, data: { adminId: account.id, accessRole, salesRole: wantsSales ? accessRole : null } });
    await Promise.all([
      tx.adminActivity.create({ data: { adminId: account.id, action: "TEAM_ACCESS_INVITED", module: "Team Members", description: "Created an invited Admin identity through TeamMember synchronization." } }),
      tx.auditLog.create({ data: { actorId: input.actorId, action: "TEAM_ACCESS_INVITED", entity: "TeamMember", entityId: member.id, metadata: { adminId: account.id, accessRole, agentCode } } }),
    ]);
    return { action: "invited", adminId: account.id, username: account.username, role: account.role.name, agentCode, activationToken, temporaryPassword } as const;
  }

  if (isProtectedTeamAdmin(existingAdmin.role)) {
    if (member.adminId === existingAdmin.id && accessRole === "ADMINISTRATOR") {
      await tx.teamMember.update({
        where: { id: member.id },
        data: { adminId: existingAdmin.id, accessRole, salesRole: null },
      });
      return {
        action: "protected",
        adminId: existingAdmin.id,
        role: existingAdmin.role.name,
        agentCode: existingAdmin.agentCode,
        activationToken: null,
      } as const;
    }
    throw new TeamSalesSyncError("The protected CEO account cannot be changed through Team Access.", 403);
  }
  if (isProtectedRole(existingAdmin.role.name) && existingAdmin.role.name !== targetRoleName && !actorIsSuperAdmin) throw new TeamSalesSyncError("This Admin identity is protected and requires Super Admin governance.", 403);
  const conflictingMember = await tx.teamMember.findFirst({ where: { adminId: existingAdmin.id, id: { not: member.id }, deletedAt: null }, select: { id: true } });
  if (conflictingMember) throw new TeamSalesSyncError("This Admin identity is already linked to another TeamMember.", 409);
  if (accessRole === "SALES_MANAGER") {
    const anotherManager = await tx.admin.findFirst({ where: { id: { not: existingAdmin.id }, deletedAt: null, role: { name: SALES_MANAGER_ROLE_NAME } }, select: { id: true } });
    if (anotherManager) throw new TeamSalesSyncError("Only one active Sales Manager is permitted.", 409);
  }
  const targetRole = await tx.role.findUnique({ where: { name: targetRoleName }, select: { id: true } });
  if (!targetRole) throw new TeamSalesSyncError("The selected Admin role is not initialized.", 422);
  const roleChanged = existingAdmin.roleId !== targetRole.id;
  const names = splitName(input.name);
  const agentCode = wantsSales && !existingAdmin.agentCode ? await generateUniqueAgentCode(names.firstName, names.lastName, async (candidate) => Boolean(await tx.admin.findFirst({ where: { agentCode: candidate, id: { not: existingAdmin.id } }, select: { id: true } }))) : undefined;
  const reissueTemporaryCredentials = existingAdmin.status === "INVITED" && Boolean(input.temporaryPasswordHash);
  await tx.admin.update({ where: { id: existingAdmin.id }, data: { roleId: targetRole.id, ...(existingAdmin.status === "SUSPENDED" || reissueTemporaryCredentials ? { status: "ACTIVE" as const, deletedAt: null } : {}), ...(reissueTemporaryCredentials ? { password: input.temporaryPasswordHash, requirePasswordChange: true, passwordResetToken: null, passwordResetExpires: null } : {}), ...(agentCode ? { agentCode } : {}) } });
  if (roleChanged) await revokeAdminSessions(existingAdmin.id, tx);
  await tx.teamMember.update({ where: { id: member.id }, data: { adminId: existingAdmin.id, accessRole, salesRole: wantsSales ? accessRole : null } });
  await Promise.all([
    tx.adminActivity.create({ data: { adminId: existingAdmin.id, action: roleChanged ? "TEAM_ACCESS_ROLE_ASSIGNED" : "TEAM_ACCESS_LINKED", module: "Team Members", description: `Assigned ${targetRoleName} access through TeamMember synchronization.` } }),
    tx.auditLog.create({ data: { actorId: input.actorId, action: roleChanged ? "TEAM_ACCESS_ROLE_ASSIGNED" : "TEAM_ACCESS_LINKED", entity: "TeamMember", entityId: member.id, metadata: { adminId: existingAdmin.id, accessRole, roleChanged } } }),
  ]);
  return { action: roleChanged ? "role-assigned" : "linked", adminId: existingAdmin.id, username: existingAdmin.username, role: targetRoleName, agentCode: agentCode ?? existingAdmin.agentCode, activationToken, temporaryPassword: reissueTemporaryCredentials ? input.temporaryPassword : undefined } as const;
}
