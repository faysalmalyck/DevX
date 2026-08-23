import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authorizeLead, leadScopeWhere } from "@/lib/auth/lead-authorization";
import { prisma } from "@/lib/db/prisma";

const presets = ["today", "week", "month", "quarter", "custom"] as const;
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

const querySchema = z.object({
  preset: z.enum(presets).default("month"),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

type DashboardRange = {
  from: Date;
  to: Date;
  preset: (typeof presets)[number];
};

function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

function startOfUtcDay(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function addUtcDays(value: Date, days: number): Date {
  const result = new Date(value);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function parseUtcDay(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);
  const result = new Date(Date.UTC(year, month - 1, day));
  return result.getUTCFullYear() === year && result.getUTCMonth() === month - 1 && result.getUTCDate() === day
    ? result
    : null;
}

function resolveRange(
  query: z.infer<typeof querySchema>,
  now = new Date()
): DashboardRange | null {
  const today = startOfUtcDay(now);

  if (query.preset === "today") {
    return { from: today, to: addUtcDays(today, 1), preset: query.preset };
  }

  if (query.preset === "week") {
    const weekday = (today.getUTCDay() + 6) % 7;
    const from = addUtcDays(today, -weekday);
    return { from, to: addUtcDays(from, 7), preset: query.preset };
  }

  if (query.preset === "month") {
    const from = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
    return {
      from,
      to: new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1)),
      preset: query.preset,
    };
  }

  if (query.preset === "quarter") {
    const startMonth = Math.floor(today.getUTCMonth() / 3) * 3;
    const from = new Date(Date.UTC(today.getUTCFullYear(), startMonth, 1));
    return {
      from,
      to: new Date(Date.UTC(today.getUTCFullYear(), startMonth + 3, 1)),
      preset: query.preset,
    };
  }

  if (!query.from || !query.to) return null;
  const from = parseUtcDay(query.from);
  const inclusiveTo = parseUtcDay(query.to);
  if (!from || !inclusiveTo || inclusiveTo < from) return null;

  const to = addUtcDays(inclusiveTo, 1);
  if (to.getTime() - from.getTime() > 366 * 24 * 60 * 60 * 1000) return null;

  return { from, to, preset: query.preset };
}

function decimalString(value: { toString(): string } | null | undefined): string {
  return value?.toString() ?? "0";
}

function dayKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const view = request.nextUrl.searchParams.get("view");
  const authorization = await authorizeLead("VIEW", undefined, view === "my" || view === "team" ? { view } : undefined);
  if (!authorization.ok) {
    return noStoreJson(
      { error: authorization.status === 401 ? "Authentication is required." : "You do not have access to sales data." },
      { status: authorization.status }
    );
  }

  const parsedQuery = querySchema.safeParse({
    preset: request.nextUrl.searchParams.get("preset") ?? undefined,
    from: request.nextUrl.searchParams.get("from") ?? undefined,
    to: request.nextUrl.searchParams.get("to") ?? undefined,
  });
  const range = parsedQuery.success ? resolveRange(parsedQuery.data) : null;
  if (!range) {
    return noStoreJson({ error: "Invalid dashboard date range." }, { status: 400 });
  }

  const scopeWhere = leadScopeWhere(authorization.scope, authorization.session.id);
  const rangeWhere = {
    ...scopeWhere,
    createdAt: { gte: range.from, lt: range.to },
  };
  const now = new Date();
  const startToday = startOfUtcDay(now);
  const startTomorrow = addUtcDays(startToday, 1);
  const followUpScope = { lead: scopeWhere };

  try {
    const [
      totalLeads,
      newLeads,
      pipelineValue,
      wonValue,
      wonCount,
      lostCount,
      pipelineRows,
      recentActivities,
      dueToday,
      overdue,
      createdForTrend,
      wonForTrend,
    ] = await Promise.all([
      prisma.lead.count({ where: rangeWhere }),
      prisma.lead.count({ where: { ...rangeWhere, status: "NEW" } }),
      prisma.lead.aggregate({
        where: {
          ...rangeWhere,
          status: { notIn: ["WON", "LOST", "DUPLICATE"] },
        },
        _sum: { estimatedValue: true },
      }),
      prisma.lead.aggregate({
        where: {
          ...scopeWhere,
          wonAt: { gte: range.from, lt: range.to },
        },
        _sum: { estimatedValue: true },
      }),
      prisma.lead.count({
        where: { ...scopeWhere, status: "WON", wonAt: { gte: range.from, lt: range.to } },
      }),
      prisma.lead.count({
        where: { ...scopeWhere, status: "LOST", lostAt: { gte: range.from, lt: range.to } },
      }),
      prisma.lead.groupBy({
        by: ["status"],
        where: rangeWhere,
        _count: { _all: true },
        _sum: { estimatedValue: true },
      }),
      prisma.leadActivity.findMany({
        where: { lead: scopeWhere },
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          type: true,
          note: true,
          createdAt: true,
          lead: { select: { id: true, fullName: true } },
          actor: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      prisma.leadFollowUp.count({
        where: {
          ...followUpScope,
          deletedAt: null,
          status: "PENDING",
          dueAt: { gte: startToday, lt: startTomorrow },
        },
      }),
      prisma.leadFollowUp.count({
        where: {
          ...followUpScope,
          deletedAt: null,
          status: "PENDING",
          dueAt: { lt: startToday },
        },
      }),
      prisma.lead.findMany({
        where: rangeWhere,
        select: { createdAt: true },
      }),
      prisma.lead.findMany({
        where: {
          ...scopeWhere,
          status: "WON",
          wonAt: { gte: range.from, lt: range.to },
        },
        select: { wonAt: true, estimatedValue: true },
      }),
    ]);

    const pipelineByStatus = new Map(
      pipelineRows.map((row) => [
        row.status,
        { count: row._count._all, value: decimalString(row._sum.estimatedValue) },
      ])
    );
    const pipeline = leadStatuses.map((status) => {
      const row = pipelineByStatus.get(status) ?? { count: 0, value: "0" };
      return {
        status,
        count: row.count,
        value: row.value,
        percentage: totalLeads > 0 ? Number(((row.count / totalLeads) * 100).toFixed(2)) : 0,
      };
    });

    const trendMap = new Map<string, { created: number; won: number; wonValue: number }>();
    for (let cursor = new Date(range.from); cursor < range.to; cursor = addUtcDays(cursor, 1)) {
      trendMap.set(dayKey(cursor), { created: 0, won: 0, wonValue: 0 });
    }
    for (const lead of createdForTrend) {
      const row = trendMap.get(dayKey(lead.createdAt));
      if (row) row.created += 1;
    }
    for (const lead of wonForTrend) {
      if (!lead.wonAt) continue;
      const row = trendMap.get(dayKey(lead.wonAt));
      if (row) {
        row.won += 1;
        row.wonValue += Number(lead.estimatedValue?.toString() ?? "0");
      }
    }

    const managerData = authorization.scope === "ALL"
      ? await loadManagerData(scopeWhere, rangeWhere)
      : null;

    return noStoreJson({
      range: {
        from: range.from.toISOString(),
        to: range.to.toISOString(),
        preset: range.preset,
      },
      summary: {
        totalLeads,
        newLeads,
        pipelineValue: decimalString(pipelineValue._sum.estimatedValue),
        wonValue: decimalString(wonValue._sum.estimatedValue),
        conversionRate: wonCount + lostCount > 0
          ? Number(((wonCount / (wonCount + lostCount)) * 100).toFixed(2))
          : 0,
        followUpsDueToday: dueToday,
        overdueFollowUps: overdue,
      },
      pipeline,
      trend: [...trendMap.entries()].map(([date, value]) => ({
        date,
        created: value.created,
        won: value.won,
        wonValue: String(value.wonValue),
      })),
      recentActivities: recentActivities.map((activity) => ({
        ...activity,
        createdAt: activity.createdAt.toISOString(),
        actor: activity.actor
          ? {
              id: activity.actor.id,
              name: `${activity.actor.firstName} ${activity.actor.lastName}`.trim(),
            }
          : null,
      })),
      ...(managerData ? managerData : {}),
    });
  } catch (error) {
    console.error("Sales dashboard load failed", error);
    return noStoreJson({ error: "Unable to load sales dashboard right now." }, { status: 500 });
  }
}

async function loadManagerData(
  scopeWhere: ReturnType<typeof leadScopeWhere>,
  rangeWhere: ReturnType<typeof leadScopeWhere> & { createdAt: { gte: Date; lt: Date } }
) {
  const [unassignedLeads, performanceRows] = await Promise.all([
    prisma.lead.count({
      where: {
        ...scopeWhere,
        assignedAgentId: null,
      },
    }),
    prisma.lead.groupBy({
      by: ["assignedAgentId"],
      where: {
        ...rangeWhere,
        assignedAgentId: { not: null },
      },
      _count: { _all: true },
      _sum: { estimatedValue: true },
    }),
  ]);

  const agentIds = performanceRows
    .map((row) => row.assignedAgentId)
    .filter((id): id is string => Boolean(id));
  const agents = agentIds.length > 0
    ? await prisma.admin.findMany({
        where: { id: { in: agentIds } },
        select: { id: true, firstName: true, lastName: true, agentCode: true },
      })
    : [];
  const agentsById = new Map(agents.map((agent) => [agent.id, agent]));

  return {
    unassignedLeads,
    agentPerformance: performanceRows
      .filter((row): row is typeof row & { assignedAgentId: string } => Boolean(row.assignedAgentId))
      .map((row) => {
        const agent = agentsById.get(row.assignedAgentId);
        return {
          agentId: row.assignedAgentId,
          agentName: agent ? `${agent.firstName} ${agent.lastName}`.trim() : "Unknown agent",
          agentCode: agent?.agentCode ?? null,
          leads: row._count._all,
          estimatedValue: decimalString(row._sum.estimatedValue),
        };
      }),
  };
}
