import { prisma } from "@/lib/db/prisma";

export const SALES_AGENT_ROLE_NAME = "Sales Agent";
export const SALES_MANAGER_ROLE_NAME = "Sales Manager";
export const SALES_OWNER_ROLE_NAMES = [
  SALES_AGENT_ROLE_NAME,
  SALES_MANAGER_ROLE_NAME,
] as const;

export function isValidAgentCode(value: string | null | undefined): value is string {
  return Boolean(
    value &&
      value.length <= 100 &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  );
}

export type SalesOwnerSummary = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  agentCode: string | null;
  status: "ACTIVE" | "SUSPENDED" | "INVITED" | "LOCKED";
  deletedAt: Date | null;
  role: (typeof SALES_OWNER_ROLE_NAMES)[number];
};

/** A backwards-compatible name for callers that specifically work with agents. */
export type SalesAgentSummary = SalesOwnerSummary;

const salesAgentSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  agentCode: true,
  status: true,
  deletedAt: true,
  role: {
    select: {
      name: true,
    },
  },
} as const;

export async function findSalesOwnerById(id: string): Promise<SalesOwnerSummary | null> {
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: salesAgentSelect,
  });

  if (!admin || !SALES_OWNER_ROLE_NAMES.includes(admin.role.name as (typeof SALES_OWNER_ROLE_NAMES)[number])) return null;

  const { role: _role, ...agent } = admin;
  return { ...agent, role: _role.name as (typeof SALES_OWNER_ROLE_NAMES)[number] };
}

export async function findActiveSalesOwnerById(id: string): Promise<SalesOwnerSummary | null> {
  const owner = await findSalesOwnerById(id);
  if (!owner || owner.status !== "ACTIVE" || owner.deletedAt) return null;
  return owner;
}

export async function findSalesAgentById(id: string): Promise<SalesAgentSummary | null> {
  const owner = await findSalesOwnerById(id);
  return owner?.role === SALES_AGENT_ROLE_NAME ? owner : null;
}

/**
 * Keeps historical referrals resolvable after an agent is suspended or
 * removed. Callers decide separately whether the agent is eligible for a new
 * assignment.
 */
export async function findSalesOwnerByCode(code: string): Promise<SalesOwnerSummary | null> {
  if (!isValidAgentCode(code)) return null;

  const admin = await prisma.admin.findUnique({
    where: { agentCode: code },
    select: salesAgentSelect,
  });

  if (!admin || !SALES_OWNER_ROLE_NAMES.includes(admin.role.name as (typeof SALES_OWNER_ROLE_NAMES)[number])) return null;

  const { role: _role, ...agent } = admin;
  return { ...agent, role: _role.name as (typeof SALES_OWNER_ROLE_NAMES)[number] };
}

/** @deprecated Use findSalesOwnerByCode; referral attribution includes the Sales Manager. */
export const findSalesAgentByCode = findSalesOwnerByCode;
