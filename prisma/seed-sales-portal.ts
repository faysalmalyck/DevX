import { PrismaClient, type PermissionAction } from "@prisma/client";

import { generateUniqueAgentCode } from "../src/lib/sales/agent-codes.ts";

const salesModules = ["Leads", "Sales Agents", "Lead Emails", "Vendor Outreach"] as const;
const allActions: PermissionAction[] = [
  "VIEW",
  "CREATE",
  "EDIT",
  "DELETE",
  "PUBLISH",
  "APPROVE",
  "EXPORT",
  "IMPORT",
  "MANAGE",
];

const salesAgentActions: PermissionAction[] = ["VIEW", "CREATE", "EDIT"];
const salesManagerLeadActions: PermissionAction[] = [
  "VIEW",
  "CREATE",
  "EDIT",
  "DELETE",
  "MANAGE",
];
const salesManagerAgentActions: PermissionAction[] = [
  "VIEW",
  "CREATE",
  "EDIT",
  "DELETE",
  "MANAGE",
];

function configuredEmails(name: string): string[] {
  const value = process.env[name];
  if (!value) return [];

  return [...new Set(
    value
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  )];
}

async function grant(
  prisma: PrismaClient,
  roleId: string,
  module: (typeof salesModules)[number],
  actions: PermissionAction[]
) {
  for (const action of actions) {
    const permission = await prisma.permission.upsert({
      where: { module_action: { module, action } },
      create: { module, action },
      update: {},
    });

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId: permission.id,
        },
      },
      create: { roleId, permissionId: permission.id },
      update: {},
    });
  }
}

async function promoteConfiguredAdmin(
  prisma: PrismaClient,
  email: string,
  roleId: string,
  roleName: "Sales Manager" | "Sales Agent"
) {
  const admin = await prisma.admin.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      roleId: true,
      status: true,
      deletedAt: true,
      agentCode: true,
    },
  });

  if (!admin || admin.deletedAt) return false;

  const needsRole = admin.roleId !== roleId;
  const needsCode = (roleName === "Sales Agent" || roleName === "Sales Manager") && !admin.agentCode;

  if (!needsRole && !needsCode) return false;

  const agentCode = needsCode
    ? await generateUniqueAgentCode(
        admin.firstName,
        admin.lastName,
        async (code) => Boolean(await prisma.admin.findUnique({
          where: { agentCode: code },
          select: { id: true },
        }))
      )
    : admin.agentCode;

  await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id: admin.id },
      data: {
        ...(needsRole ? { roleId } : {}),
        ...(needsCode ? { agentCode } : {}),
      },
    });

    // Role claims are in JWTs. Drop sessions whenever a role changes so the
    // person signs in again with fresh claims.
    if (needsRole) {
      await tx.adminSession.deleteMany({ where: { adminId: admin.id } });
    }

    await tx.adminActivity.create({
      data: {
        adminId: admin.id,
        action: needsRole ? "SALES_ROLE_ASSIGNED" : "SALES_AGENT_CODE_ASSIGNED",
        module: "Sales Agents",
        description: `Sales portal seed ${needsRole ? "assigned" : "confirmed"} the ${roleName} role.`,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: null,
        action: needsRole ? "SALES_ROLE_ASSIGNED" : "SALES_AGENT_CODE_ASSIGNED",
        entity: "Admin",
        entityId: admin.id,
        metadata: {
          source: "sales-portal-seed",
          role: roleName,
          roleChanged: needsRole,
          agentCodeAssigned: needsCode,
        },
      },
    });
  });

  return true;
}

/**
 * Idempotently establishes sales roles and permissions. It intentionally does
 * not infer real people from TeamMember titles. Optional explicit environment
 * values may identify pre-existing Admin accounts for promotion:
 *
 * - SALES_MANAGER_EMAIL=manager@example.com
 * - SALES_AGENT_EMAILS=agent.one@example.com,agent.two@example.com
 */
export async function seedSalesPortal(prisma: PrismaClient) {
  const [salesAgentRole, salesManagerRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: "Sales Agent" },
      create: {
        name: "Sales Agent",
        slug: "sales-agent",
        description: "Owns assigned sales leads and follow-ups.",
        isSystem: true,
      },
      update: {},
    }),
    prisma.role.upsert({
      where: { name: "Sales Manager" },
      create: {
        name: "Sales Manager",
        slug: "sales-manager",
        description: "Manages sales agents and the sales pipeline.",
        isSystem: true,
      },
      update: {},
    }),
  ]);

  for (const module of salesModules) {
    for (const action of allActions) {
      await prisma.permission.upsert({
        where: { module_action: { module, action } },
        create: { module, action },
        update: {},
      });
    }
  }

  await Promise.all([
    grant(prisma, salesAgentRole.id, "Leads", salesAgentActions),
    grant(prisma, salesManagerRole.id, "Leads", salesManagerLeadActions),
    grant(prisma, salesManagerRole.id, "Sales Agents", salesManagerAgentActions),
    grant(prisma, salesAgentRole.id, "Lead Emails", ["VIEW", "CREATE", "EDIT"] as PermissionAction[]),
    grant(prisma, salesManagerRole.id, "Lead Emails", ["VIEW", "CREATE", "EDIT", "MANAGE"] as PermissionAction[]),
    grant(prisma, salesAgentRole.id, "Vendor Outreach", ["VIEW", "CREATE", "EDIT"] as PermissionAction[]),
    grant(prisma, salesManagerRole.id, "Vendor Outreach", ["VIEW", "CREATE", "EDIT", "MANAGE"] as PermissionAction[]),
  ]);

  // Existing privileged roles retain their current authority and explicitly
  // receive sales permissions. Super Admin roles bypass server checks already,
  // but explicit grants keep role data comprehensible in management UIs.
  const privilegedRoles = await prisma.role.findMany({
    where: {
      OR: [
        { name: { in: ["CEO", "Administrator"] } },
        { isSuperAdmin: true },
      ],
    },
    select: { id: true },
  });

  for (const role of privilegedRoles) {
    await Promise.all(salesModules.map((module) => grant(prisma, role.id, module, allActions)));
  }

  const managerEmail = configuredEmails("SALES_MANAGER_EMAIL")[0];
  const managerPromoted = managerEmail
    ? await promoteConfiguredAdmin(prisma, managerEmail, salesManagerRole.id, "Sales Manager")
    : false;

  let agentsPromoted = 0;
  for (const email of configuredEmails("SALES_AGENT_EMAILS").filter((email) => email !== managerEmail)) {
    if (await promoteConfiguredAdmin(prisma, email, salesAgentRole.id, "Sales Agent")) {
      agentsPromoted += 1;
    }
  }

  // Existing Sales Agent accounts are an explicit durable signal, unlike a
  // public TeamMember job title. Backfill only their missing immutable codes.
  const existingAgentsMissingCode = await prisma.admin.findMany({
    where: {
      roleId: salesAgentRole.id,
      deletedAt: null,
      agentCode: null,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });

  for (const agent of existingAgentsMissingCode) {
    const agentCode = await generateUniqueAgentCode(
      agent.firstName,
      agent.lastName,
      async (code) => Boolean(await prisma.admin.findUnique({
        where: { agentCode: code },
        select: { id: true },
      }))
    );

    await prisma.$transaction([
      prisma.admin.update({
        where: { id: agent.id },
        data: { agentCode },
      }),
      prisma.adminActivity.create({
        data: {
          adminId: agent.id,
          action: "SALES_AGENT_CODE_ASSIGNED",
          module: "Sales Agents",
          description: "Sales portal seed assigned an immutable referral code.",
        },
      }),
      prisma.auditLog.create({
        data: {
          actorId: null,
          action: "SALES_AGENT_CODE_ASSIGNED",
          entity: "Admin",
          entityId: agent.id,
          metadata: { source: "sales-portal-seed", role: "Sales Agent" },
        },
      }),
    ]);
  }

  return {
    managerPromoted,
    agentsPromoted,
    agentCodesBackfilled: existingAgentsMissingCode.length,
  };
}
