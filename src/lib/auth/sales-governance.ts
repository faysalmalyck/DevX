import { getActiveSession, type SessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export type SalesGovernanceAuthorization =
  | { ok: true; session: SessionUser }
  | { ok: false; status: 401 | 403 };

export type OperationsWorkspaceAuthorization =
  | { ok: true; session: SessionUser }
  | { ok: false; status: 401 | 403; salesRole?: boolean };

export function isSalesRole(roleName: string): boolean {
  return roleName === "Sales Agent" || roleName === "Sales Manager";
}

export function isSalesGovernanceRole(role: {
  name: string;
  isSuperAdmin: boolean;
}): boolean {
  return role.isSuperAdmin || role.name === "CEO";
}

/**
 * Sales Managers and Sales Agents work exclusively through /sales. This
 * prevents a sales session from loading the organisation-wide Admin workspace
 * while retaining all existing non-sales Admin behaviour.
 */
export async function authorizeOperationsWorkspace(): Promise<OperationsWorkspaceAuthorization> {
  const session = await getActiveSession();
  if (!session || session.userType !== "admin") {
    return { ok: false, status: 401 };
  }

  if (isSalesRole(session.role)) {
    return { ok: false, status: 403, salesRole: true };
  }

  return { ok: true, session };
}

/**
 * Super Admin Sales Management is governance, not the Sales Manager's daily
 * operations workspace. Validate the live Admin and Role record rather than
 * relying on a JWT role claim or general Sales permissions.
 */
export async function authorizeSalesGovernance(): Promise<SalesGovernanceAuthorization> {
  const session = await getActiveSession();
  if (!session || session.userType !== "admin") {
    return { ok: false, status: 401 };
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.id, deletedAt: null },
    select: {
      status: true,
      role: {
        select: {
          name: true,
          isSuperAdmin: true,
        },
      },
    },
  });

  if (!admin || admin.status !== "ACTIVE") {
    return { ok: false, status: 401 };
  }

  if (!isSalesGovernanceRole(admin.role)) {
    return { ok: false, status: 403 };
  }

  return { ok: true, session };
}
