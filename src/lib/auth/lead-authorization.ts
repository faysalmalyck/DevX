import type { Prisma } from "@prisma/client";

import { getActiveSession, type SessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  SALES_AGENT_ROLE_NAME,
  SALES_MANAGER_ROLE_NAME,
} from "@/lib/sales/agents";
import type { PermissionAction } from "@/lib/permissions/rbac";
import { checkPermission } from "@/lib/permissions/rbac.server";

export type LeadScope = "ALL" | "OWN";
export type LeadView = "my" | "team";

export type LeadAuthorizationResult =
  | {
      ok: true;
      scope: LeadScope;
      session: SessionUser;
    }
  | {
      ok: false;
      status: 401 | 403 | 404;
      passwordChangeRequired?: boolean;
    };

export function leadScopeWhere(
  scope: LeadScope,
  adminId: string
): Prisma.LeadWhereInput {
  return scope === "ALL"
    ? { deletedAt: null }
    : {
        assignedAgentId: adminId,
        deletedAt: null,
      };
}

/**
 * Central sales lead authorization. Sales owners receive an ownership scope
 * based exclusively on `assignedAgentId`; provenance (`createdByAgentId`) is
 * intentionally never part of access control.
 */
export async function authorizeLead(
  action: PermissionAction,
  leadId?: string,
  options?: { view?: LeadView },
): Promise<LeadAuthorizationResult> {
  const session = await getActiveSession();
  if (!session || session.userType !== "admin") {
    return { ok: false, status: 401 };
  }

  if (session.requirePasswordChange) {
    return { ok: false, status: 403, passwordChangeRequired: true };
  }

  const [allowed, canManage, admin] = await Promise.all([
    checkPermission(session.id, "Leads", action),
    checkPermission(session.id, "Leads", "MANAGE"),
    prisma.admin.findUnique({
      where: { id: session.id, deletedAt: null },
      select: {
        status: true,
        role: { select: { name: true } },
      },
    }),
  ]);

  if (!admin || admin.status !== "ACTIVE") {
    return { ok: false, status: 401 };
  }

  if (!allowed) {
    return { ok: false, status: 403 };
  }

  if (options?.view === "team" && !canManage) {
    return { ok: false, status: 403 };
  }

  const scope: LeadScope = options?.view === "my" && admin.role.name === SALES_MANAGER_ROLE_NAME
    ? "OWN"
    : canManage
      ? "ALL"
      : admin.role.name === SALES_AGENT_ROLE_NAME || admin.role.name === SALES_MANAGER_ROLE_NAME
        ? "OWN"
        : "ALL";

  // A user with limited Leads permissions must be an actual Sales owner. Do
  // not silently give arbitrary administrator roles an OWN scope.
  if (scope === "ALL" && !canManage) {
    return { ok: false, status: 403 };
  }

  if (!leadId) {
    return { ok: true, scope, session };
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      assignedAgentId: true,
      deletedAt: true,
    },
  });

  // Soft-deleted leads are intentionally indistinguishable from absent leads
  // to callers without a dedicated restore workflow.
  if (!lead || lead.deletedAt) {
    return { ok: false, status: 404 };
  }

  if (scope === "OWN" && lead.assignedAgentId !== session.id) {
    return { ok: false, status: 403 };
  }

  return { ok: true, scope, session };
}
