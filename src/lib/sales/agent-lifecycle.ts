import { Prisma, type AdminStatus } from "@prisma/client";

import { hashPassword } from "@/lib/auth/hash";
import { revokeAdminSessions } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { generateUniqueAgentCode } from "@/lib/sales/agent-codes";
import {
  SALES_AGENT_ROLE_NAME,
  SALES_MANAGER_ROLE_NAME,
  SALES_OWNER_ROLE_NAMES,
} from "@/lib/sales/agents";

export const SALES_TEAM_ROLE_NAMES = [
  SALES_AGENT_ROLE_NAME,
  SALES_MANAGER_ROLE_NAME,
] as const;

export type SalesTeamRoleName = (typeof SALES_TEAM_ROLE_NAMES)[number];

export function isSalesTeamRole(roleName: string): roleName is SalesTeamRoleName {
  return (SALES_TEAM_ROLE_NAMES as readonly string[]).includes(roleName);
}

export class SalesAccountLifecycleError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 404 | 409 | 422
  ) {
    super(message);
    this.name = "SalesAccountLifecycleError";
  }
}

export type SalesTeamAccount = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  designation: string | null;
  department: string | null;
  agentCode: string | null;
  status: AdminStatus;
  role: SalesTeamRoleName;
  lastLogin: Date | null;
  createdAt: Date;
  activeLeadCount: number;
  pendingFollowUpCount: number;
};

export async function listSalesTeamAccounts(): Promise<SalesTeamAccount[]> {
  const accounts = await prisma.admin.findMany({
    where: {
      deletedAt: null,
      role: { name: { in: [...SALES_TEAM_ROLE_NAMES] } },
      teamMember: { deletedAt: null },
    },
    orderBy: [
      { status: "asc" },
      { firstName: "asc" },
      { lastName: "asc" },
    ],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      designation: true,
      department: true,
      agentCode: true,
      status: true,
      lastLogin: true,
      createdAt: true,
      role: { select: { name: true } },
      _count: {
        select: {
          assignedLeads: { where: { deletedAt: null } },
          assignedFollowUps: {
            where: {
              deletedAt: null,
              status: "PENDING",
              lead: { deletedAt: null },
            },
          },
        },
      },
    },
  });

  return accounts.map((account) => ({
    id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    username: account.username,
    designation: account.designation,
    department: account.department,
    agentCode: account.agentCode,
    status: account.status,
    role: account.role.name as SalesTeamRoleName,
    lastLogin: account.lastLogin,
    createdAt: account.createdAt,
    activeLeadCount: account._count.assignedLeads,
    pendingFollowUpCount: account._count.assignedFollowUps,
  }));
}

export type CreateSalesAccountInput = {
  actorId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  initialPassword: string;
  role: SalesTeamRoleName;
  phone?: string | null;
  designation?: string | null;
  department?: string | null;
};

export type CreatedSalesAccount = Pick<
  SalesTeamAccount,
  | "id"
  | "firstName"
  | "lastName"
  | "email"
  | "username"
  | "agentCode"
  | "status"
  | "role"
>;

/**
 * Provisions a Sales Agent or Sales Manager through the existing Admin auth
 * model. The initial password is hashed before any database work and is never
 * returned, recorded in audit metadata, or written to logs.
 */
export async function createSalesAccount(
  input: CreateSalesAccountInput
): Promise<CreatedSalesAccount> {
  const password = await hashPassword(input.initialPassword);
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim();

  try {
    return await withSerializableRetry(async (tx) => {
      const role = await tx.role.findUnique({
        where: { name: input.role },
        select: { id: true, name: true },
      });
      if (!role || !isSalesTeamRole(role.name)) {
        throw new SalesAccountLifecycleError(
          "Sales roles have not been initialized. Run the Sales portal seed before creating accounts.",
          422
        );
      }

      const [emailInUse, usernameInUse] = await Promise.all([
        tx.admin.findFirst({
          where: { email, deletedAt: null },
          select: { id: true },
        }),
        tx.admin.findFirst({
          where: { username, deletedAt: null },
          select: { id: true },
        }),
      ]);
      if (emailInUse || usernameInUse) {
        throw new SalesAccountLifecycleError(
          "An account already uses that email address or username.",
          409
        );
      }

      const agentCode = isSalesTeamRole(role.name)
        ? await generateUniqueAgentCode(
            input.firstName,
            input.lastName,
            async (candidate) => Boolean(await tx.admin.findUnique({
              where: { agentCode: candidate },
              select: { id: true },
            }))
          )
        : null;

      const account = await tx.admin.create({
        data: {
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email,
          username,
          password,
          phone: input.phone?.trim() || null,
          designation: input.designation?.trim() || null,
          department: input.department?.trim() || null,
          roleId: role.id,
          status: "ACTIVE",
          // The first successful login is redirected to the password-change
          // route, and Sales APIs remain unavailable until it is completed.
          requirePasswordChange: true,
          agentCode,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          username: true,
          agentCode: true,
          status: true,
        },
      });

      await Promise.all([
        tx.adminActivity.create({
          data: {
            adminId: account.id,
            action: "SALES_ACCOUNT_CREATED",
            module: "Sales Agents",
            description: `Sales Management created a ${role.name} account.`,
          },
        }),
        tx.auditLog.create({
          data: {
            actorId: input.actorId,
            action: "SALES_ACCOUNT_CREATED",
            entity: "Admin",
            entityId: account.id,
            metadata: {
              role: role.name,
              agentCode: account.agentCode,
              requirePasswordChange: true,
            },
          },
        }),
      ]);

      return { ...account, role: role.name };
    });
  } catch (error) {
    const duplicate =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002";
    if (duplicate) {
      throw new SalesAccountLifecycleError(
        "An account already uses that email address, username, or referral code.",
        409
      );
    }
    throw error;
  }
}

type SuspendSalesAccountInput = {
  actorId: string;
  accountId: string;
  reassignToAgentId?: string;
};

type LifecycleResult = {
  accountId: string;
  status: AdminStatus;
  reassignedLeadCount: number;
  reassignedFollowUpCount: number;
};

async function requireActiveReplacement(
  tx: Prisma.TransactionClient,
  replacementId: string,
  suspendedAccountId: string
) {
  if (replacementId === suspendedAccountId) {
    throw new SalesAccountLifecycleError(
      "Choose a different active Sales owner for reassignment.",
      422
    );
  }

  const replacement = await tx.admin.findFirst({
    where: {
      id: replacementId,
      status: "ACTIVE",
      deletedAt: null,
      role: { name: { in: [...SALES_OWNER_ROLE_NAMES] } },
    },
    select: { id: true },
  });

  if (!replacement) {
    throw new SalesAccountLifecycleError(
      "Choose an active Sales owner for reassignment.",
      422
    );
  }
}

async function suspendSalesAccountInTransaction(
  tx: Prisma.TransactionClient,
  input: SuspendSalesAccountInput
): Promise<LifecycleResult> {
  if (input.actorId === input.accountId) {
    throw new SalesAccountLifecycleError(
      "You cannot suspend your own account from Sales Management.",
      400
    );
  }

  const account = await tx.admin.findFirst({
    where: {
      id: input.accountId,
      deletedAt: null,
      role: { name: { in: [...SALES_TEAM_ROLE_NAMES] } },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      status: true,
      role: { select: { name: true } },
    },
  });

  if (!account) {
    throw new SalesAccountLifecycleError("Sales account not found.", 404);
  }
  if (account.status !== "ACTIVE") {
    throw new SalesAccountLifecycleError(
      "Only active Sales accounts can be suspended.",
      409
    );
  }

  const [assignedLeads, pendingFollowUps] = await Promise.all([
    tx.lead.findMany({
      where: { assignedAgentId: account.id, deletedAt: null },
      select: { id: true },
    }),
    tx.leadFollowUp.count({
      where: {
        assignedAgentId: account.id,
        deletedAt: null,
        status: "PENDING",
        lead: { deletedAt: null },
      },
    }),
  ]);

  // Sales-team work always rolls up to the active Sales Manager when a
  // contributor is deactivated. The explicit replacement override remains
  // available for Super Admins, but open work is never left orphaned by default.
  let replacementId = input.reassignToAgentId;
  if (!replacementId && isSalesTeamRole(account.role.name) && (assignedLeads.length > 0 || pendingFollowUps > 0)) {
    const manager = await tx.admin.findFirst({
      where: { status: "ACTIVE", deletedAt: null, role: { name: SALES_MANAGER_ROLE_NAME } },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });
    if (!manager) throw new SalesAccountLifecycleError("An active Sales Manager is required before deactivating this Sales Agent.", 422);
    replacementId = manager.id;
  }

  const needsReassignment = assignedLeads.length > 0 || pendingFollowUps > 0;
  if (needsReassignment && !replacementId) {
    throw new SalesAccountLifecycleError(
      "Reassign this account's open leads and pending follow-ups before suspending it.",
      422
    );
  }
  if (replacementId) {
    await requireActiveReplacement(tx, replacementId, account.id);
  }

  // Update the account before its work. In a serializable transaction this
  // makes a competing lifecycle change fail rather than leaving a partial
  // reassignment behind.
  const suspended = await tx.admin.updateMany({
    where: {
      id: account.id,
      status: "ACTIVE",
      deletedAt: null,
      role: { name: { in: [...SALES_TEAM_ROLE_NAMES] } },
    },
    data: { status: "SUSPENDED" },
  });
  if (suspended.count !== 1) {
    throw new SalesAccountLifecycleError(
      "The Sales account changed before it could be suspended. Refresh and try again.",
      409
    );
  }

  let reassignedLeadCount = 0;
  let reassignedFollowUpCount = 0;

  if (replacementId) {
    const reassignedLeads = await tx.lead.updateMany({
      where: { assignedAgentId: account.id, deletedAt: null },
      data: { assignedAgentId: replacementId },
    });
    reassignedLeadCount = reassignedLeads.count;

    const reassignedFollowUps = await tx.leadFollowUp.updateMany({
      where: {
        assignedAgentId: account.id,
        deletedAt: null,
        status: "PENDING",
        lead: { deletedAt: null },
      },
      data: { assignedAgentId: replacementId },
    });
    reassignedFollowUpCount = reassignedFollowUps.count;

    if (assignedLeads.length > 0) {
      await tx.leadActivity.createMany({
        data: assignedLeads.map((lead) => ({
          leadId: lead.id,
          actorId: input.actorId,
          type: "ASSIGNMENT" as const,
          metadata: {
            oldAssignedAgentId: account.id,
            newAssignedAgentId: replacementId,
            reason: "sales_account_suspended",
          },
        })),
      });
    }
  }

  await revokeAdminSessions(account.id, tx);

  const accountName = `${account.firstName} ${account.lastName}`.trim();
  await Promise.all([
    tx.adminActivity.create({
      data: {
        adminId: account.id,
        action: "SALES_ACCOUNT_SUSPENDED",
        module: "Sales Agents",
        description: `Sales Management suspended ${accountName || account.id} and revoked active sessions.`,
      },
    }),
    tx.auditLog.create({
      data: {
        actorId: input.actorId,
        action: "SALES_ACCOUNT_SUSPENDED",
        entity: "Admin",
        entityId: account.id,
        metadata: {
          role: account.role.name,
          reassignToAgentId: input.reassignToAgentId ?? null,
          reassignedLeadCount,
          reassignedFollowUpCount,
        },
      },
    }),
  ]);

  return {
    accountId: account.id,
    status: "SUSPENDED",
    reassignedLeadCount,
    reassignedFollowUpCount,
  };
}

async function withSerializableRetry<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  const attempts = 2;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      const retryable =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2034";
      if (!retryable || attempt === attempts - 1) throw error;
    }
  }

  throw new Error("Sales account lifecycle transaction could not be completed.");
}

/**
 * Suspends a Sales Agent or Sales Manager only after every live assignment is
 * explicitly handed to another active Sales Agent. Status, session revocation,
 * reassignment, and audit data commit as one database transaction.
 */
export async function suspendSalesAccount(
  input: SuspendSalesAccountInput
): Promise<LifecycleResult> {
  return withSerializableRetry((tx) => suspendSalesAccountInTransaction(tx, input));
}

export async function reactivateSalesAccount(input: {
  actorId: string;
  accountId: string;
}): Promise<LifecycleResult> {
  if (input.actorId === input.accountId) {
    throw new SalesAccountLifecycleError(
      "Use your profile or security settings to manage your own account.",
      400
    );
  }

  return withSerializableRetry(async (tx) => {
    const reactivated = await tx.admin.updateMany({
      where: {
        id: input.accountId,
        status: "SUSPENDED",
        deletedAt: null,
        role: { name: { in: [...SALES_TEAM_ROLE_NAMES] } },
      },
      data: { status: "ACTIVE" },
    });
    if (reactivated.count !== 1) {
      const exists = await tx.admin.findFirst({
        where: {
          id: input.accountId,
          deletedAt: null,
          role: { name: { in: [...SALES_TEAM_ROLE_NAMES] } },
        },
        select: { id: true },
      });
      throw new SalesAccountLifecycleError(
        exists
          ? "Only suspended Sales accounts can be reactivated."
          : "Sales account not found.",
        exists ? 409 : 404
      );
    }

    await Promise.all([
      tx.adminActivity.create({
        data: {
          adminId: input.accountId,
          action: "SALES_ACCOUNT_REACTIVATED",
          module: "Sales Agents",
          description: "Sales Management reactivated this account.",
        },
      }),
      tx.auditLog.create({
        data: {
          actorId: input.actorId,
          action: "SALES_ACCOUNT_REACTIVATED",
          entity: "Admin",
          entityId: input.accountId,
        },
      }),
    ]);

    return {
      accountId: input.accountId,
      status: "ACTIVE",
      reassignedLeadCount: 0,
      reassignedFollowUpCount: 0,
    };
  });
}

/**
 * Removes all persisted sessions for another Sales account without changing
 * its status. The active caller is intentionally excluded so a Super Admin
 * uses their own Security page for self-service session management.
 */
export async function revokeSalesAccountSessions(input: {
  actorId: string;
  accountId: string;
}): Promise<{ accountId: string; revokedSessionCount: number }> {
  if (input.actorId === input.accountId) {
    throw new SalesAccountLifecycleError(
      "Use your security settings to manage your own sessions.",
      400
    );
  }

  return withSerializableRetry(async (tx) => {
    const account = await tx.admin.findFirst({
      where: {
        id: input.accountId,
        deletedAt: null,
        role: { name: { in: [...SALES_TEAM_ROLE_NAMES] } },
      },
      select: { id: true, firstName: true, lastName: true },
    });
    if (!account) {
      throw new SalesAccountLifecycleError("Sales account not found.", 404);
    }

    const revokedSessionCount = await revokeAdminSessions(account.id, tx);
    const accountName = `${account.firstName} ${account.lastName}`.trim();
    await Promise.all([
      tx.adminActivity.create({
        data: {
          adminId: account.id,
          action: "SALES_ACCOUNT_SESSIONS_REVOKED",
          module: "Sales Agents",
          description: `Sales Management revoked all sessions for ${accountName || account.id}.`,
        },
      }),
      tx.auditLog.create({
        data: {
          actorId: input.actorId,
          action: "SALES_ACCOUNT_SESSIONS_REVOKED",
          entity: "Admin",
          entityId: account.id,
          metadata: { revokedSessionCount },
        },
      }),
    ]);

    return { accountId: account.id, revokedSessionCount };
  });
}
