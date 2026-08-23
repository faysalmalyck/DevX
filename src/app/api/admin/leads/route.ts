import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  authorizeLead,
  leadScopeWhere,
} from "@/lib/auth/lead-authorization";
import { hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { prisma } from "@/lib/db/prisma";
import { findActiveSalesOwnerById } from "@/lib/sales/agents";

const leadStatuses = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
  "DUPLICATE",
] as const;
const leadSources = [
  "AGENT_REFERRAL",
  "AGENT_MANUAL",
  "WEBSITE_CONTACT",
  "WEBSITE_CONSULTATION",
  "WEBSITE_PRICING",
  "WHATSAPP",
  "IMPORTED",
  "OTHER",
] as const;
const manualSources = ["AGENT_MANUAL", "WHATSAPP", "IMPORTED", "OTHER"] as const;

const listQuerySchema = z.object({
  q: z.string().trim().max(120).default(""),
  status: z.enum(leadStatuses).optional(),
  source: z.enum(leadSources).optional(),
  assignedAgentId: z.string().trim().min(1).max(128).optional(),
  assigned: z.enum(["unassigned"]).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sort: z.enum(["createdAt", "updatedAt", "fullName", "status"]).default("createdAt"),
  direction: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).max(100000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const optionalText = (maxLength: number) =>
  z.string().trim().max(maxLength).optional().transform((value) => value || undefined);

const manualLeadSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email().max(320),
    phone: z
      .string()
      .trim()
      .max(32)
      .refine((value) => !value || /^[0-9+().\-\s]{7,32}$/.test(value), "Enter a valid phone number.")
      .optional()
      .transform((value) => value || undefined),
    company: optionalText(160),
    message: optionalText(5000),
    budgetRange: optionalText(120),
    estimatedValue: z.coerce.number().finite().min(0).max(9999999999.99).optional(),
    assignedAgentId: z.string().trim().min(1).max(128).nullable().optional(),
    source: z.enum(manualSources).optional(),
  })
  .strict();

function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

function parseUtcDay(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);
  const result = new Date(Date.UTC(year, month - 1, day));
  return result.getUTCFullYear() === year && result.getUTCMonth() === month - 1 && result.getUTCDate() === day
    ? result
    : null;
}

function addUtcDays(value: Date, days: number): Date {
  const result = new Date(value);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export async function GET(request: NextRequest) {
  const view = request.nextUrl.searchParams.get("view");
  const authorization = await authorizeLead("VIEW", undefined, view === "my" || view === "team" ? { view } : undefined);
  if (!authorization.ok) {
    return noStoreJson(
      { error: authorization.status === 401 ? "Authentication is required." : "You do not have access to leads." },
      { status: authorization.status }
    );
  }

  const parsedQuery = listQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get("q") ?? "",
    status: request.nextUrl.searchParams.get("status") ?? undefined,
    source: request.nextUrl.searchParams.get("source") ?? undefined,
    assignedAgentId: request.nextUrl.searchParams.get("assignedAgentId") ?? undefined,
    assigned: request.nextUrl.searchParams.get("assigned") ?? undefined,
    from: request.nextUrl.searchParams.get("from") ?? undefined,
    to: request.nextUrl.searchParams.get("to") ?? undefined,
    sort: request.nextUrl.searchParams.get("sort") ?? undefined,
    direction: request.nextUrl.searchParams.get("direction") ?? undefined,
    page: request.nextUrl.searchParams.get("page") ?? undefined,
    pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
  });

  if (!parsedQuery.success) {
    return noStoreJson({ error: "Invalid lead filters." }, { status: 400 });
  }

  const query = parsedQuery.data;
  if (
    authorization.scope === "OWN" &&
    query.assignedAgentId &&
    query.assignedAgentId !== authorization.session.id
  ) {
    return noStoreJson({ error: "You can only view your assigned leads." }, { status: 403 });
  }
  if (query.assigned && query.assignedAgentId) {
    return noStoreJson({ error: "Choose either a specific agent or unassigned leads." }, { status: 400 });
  }
  if (authorization.scope === "OWN" && query.assigned === "unassigned") {
    return noStoreJson({ error: "You can only view your assigned leads." }, { status: 403 });
  }

  const from = query.from ? parseUtcDay(query.from) : null;
  const inclusiveTo = query.to ? parseUtcDay(query.to) : null;
  if ((query.from && !from) || (query.to && !inclusiveTo) || (from && inclusiveTo && inclusiveTo < from)) {
    return noStoreJson({ error: "Invalid lead date range." }, { status: 400 });
  }

  const where = {
    ...leadScopeWhere(authorization.scope, authorization.session.id),
    ...(query.status ? { status: query.status } : {}),
    ...(query.source ? { source: query.source } : {}),
    ...(authorization.scope === "ALL" && query.assignedAgentId
      ? { assignedAgentId: query.assignedAgentId }
      : {}),
    ...(authorization.scope === "ALL" && query.assigned === "unassigned"
      ? { assignedAgentId: null }
      : {}),
    ...(from || inclusiveTo
      ? {
          createdAt: {
            ...(from ? { gte: from } : {}),
            ...(inclusiveTo ? { lt: addUtcDays(inclusiveTo, 1) } : {}),
          },
        }
      : {}),
    ...(query.q
      ? {
          OR: [
            { fullName: { contains: query.q, mode: "insensitive" as const } },
            { email: { contains: query.q, mode: "insensitive" as const } },
            { company: { contains: query.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  try {
    const total = await prisma.lead.count({ where });
    const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
    const page = Math.min(query.page, pageCount);
    const leads = await prisma.lead.findMany({
      where,
      orderBy: [
        { [query.sort]: query.direction },
        { id: "asc" },
      ],
      skip: (page - 1) * query.pageSize,
      take: query.pageSize,
      select: {
        id: true,
        fullName: true,
        email: true,
        company: true,
        estimatedValue: true,
        status: true,
        source: true,
        captureSurface: true,
        assignedAgentId: true,
        createdAt: true,
        updatedAt: true,
        assignedAgent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            agentCode: true,
          },
        },
        followUps: {
          where: { deletedAt: null, status: "PENDING" },
          orderBy: { dueAt: "asc" },
          take: 1,
          select: { id: true, dueAt: true },
        },
      },
    });

    return noStoreJson({
      leads: leads.map((lead) => ({
        ...lead,
        estimatedValue: lead.estimatedValue?.toString() ?? null,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
        assignedAgent: lead.assignedAgent
          ? {
              id: lead.assignedAgent.id,
              name: `${lead.assignedAgent.firstName} ${lead.assignedAgent.lastName}`.trim(),
              agentCode: lead.assignedAgent.agentCode,
            }
          : null,
        nextFollowUp: lead.followUps[0]
          ? { id: lead.followUps[0].id, dueAt: lead.followUps[0].dueAt.toISOString() }
          : null,
        followUps: undefined,
      })),
      pagination: { page, pageSize: query.pageSize, total, pageCount },
      scope: authorization.scope,
    });
  } catch (error) {
    console.error("Lead list load failed", error);
    return noStoreJson({ error: "Unable to load leads right now." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeLead("CREATE");
  if (!authorization.ok) {
    return noStoreJson(
      { error: authorization.status === 401 ? "Authentication is required." : "You do not have permission to create leads." },
      { status: authorization.status }
    );
  }

  if (!hasValidAdminCsrf(request)) {
    return noStoreJson({ error: "Invalid request token." }, { status: 403 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsedBody = manualLeadSchema.safeParse(body);
  if (!parsedBody.success) {
    return noStoreJson({ error: "Invalid lead details." }, { status: 400 });
  }

  const input = parsedBody.data;
  const assignedAgentId = authorization.scope === "OWN"
    ? authorization.session.id
    : input.assignedAgentId ?? null;

  if (assignedAgentId && authorization.scope === "ALL") {
    const target = await findActiveSalesOwnerById(assignedAgentId);
    if (!target) {
      return noStoreJson({ error: "Choose an active Sales owner for assignment." }, { status: 422 });
    }
  }

  const source = authorization.scope === "OWN" ? "AGENT_MANUAL" : input.source ?? "AGENT_MANUAL";

  try {
    const lead = await prisma.$transaction(async (tx) => {
      const created = await tx.lead.create({
        data: {
          fullName: input.fullName,
          email: input.email,
          phone: input.phone ?? null,
          company: input.company ?? null,
          message: input.message ?? null,
          budgetRange: input.budgetRange ?? null,
          estimatedValue: input.estimatedValue,
          source,
          captureSurface: "MANUAL",
          assignedAgentId,
          createdByAgentId: authorization.session.id,
        },
        select: {
          id: true,
          fullName: true,
          status: true,
          source: true,
          assignedAgentId: true,
          createdAt: true,
        },
      });

      await tx.leadActivity.create({
        data: {
          leadId: created.id,
          actorId: authorization.session.id,
          type: "CREATED",
          metadata: { source, captureSurface: "MANUAL", assignedAgentId },
        },
      });
      await tx.adminActivity.create({
        data: {
          adminId: authorization.session.id,
          action: "LEAD_CREATED",
          module: "Leads",
          description: `Created lead ${created.id}.`,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: authorization.session.id,
          action: "LEAD_CREATED",
          entity: "Lead",
          entityId: created.id,
          metadata: { source, assignedAgentId },
        },
      });

      return created;
    });

    return noStoreJson(
      {
        lead: {
          ...lead,
          createdAt: lead.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead creation failed", error);
    return noStoreJson({ error: "Unable to create this lead right now." }, { status: 500 });
  }
}
