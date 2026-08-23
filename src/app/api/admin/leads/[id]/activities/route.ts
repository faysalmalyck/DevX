import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { authorizeLead, leadScopeWhere } from "@/lib/auth/lead-authorization";
import { prisma } from "@/lib/db/prisma";
import { recordLeadAdminAudit } from "@/lib/sales/audit";

const idSchema = z.string().trim().min(1).max(128);
const querySchema = z.object({
  page: z.coerce.number().int().min(1).max(100000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(30),
});
const createActivitySchema = z
  .object({
    type: z.enum(["NOTE", "CONTACT_ATTEMPT"]),
    note: z.string().trim().min(1).max(5000),
  })
  .strict();

type RouteContext = { params: Promise<{ id: string }> };

class LeadActivityMutationError extends Error {}

function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

async function getId(params: RouteContext["params"]) {
  const { id } = await params;
  const parsed = idSchema.safeParse(id);
  return parsed.success ? parsed.data : null;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const id = await getId(params);
  if (!id) return noStoreJson({ error: "Lead not found." }, { status: 404 });
  const authorization = await authorizeLead("VIEW", id);
  if (!authorization.ok) return noStoreJson({ error: "You do not have access to this lead." }, { status: authorization.status });

  const query = querySchema.safeParse({
    page: request.nextUrl.searchParams.get("page") ?? undefined,
    pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
  });
  if (!query.success) return noStoreJson({ error: "Invalid activity pagination." }, { status: 400 });

  try {
    const where = {
      leadId: id,
      lead: leadScopeWhere(authorization.scope, authorization.session.id),
    };
    const [total, activities] = await Promise.all([
      prisma.leadActivity.count({ where }),
      prisma.leadActivity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.data.page - 1) * query.data.pageSize,
        take: query.data.pageSize,
        include: { actor: { select: { id: true, firstName: true, lastName: true } } },
      }),
    ]);
    return noStoreJson({
      activities: activities.map((activity) => ({
        ...activity,
        createdAt: activity.createdAt.toISOString(),
        actor: activity.actor ? { id: activity.actor.id, name: `${activity.actor.firstName} ${activity.actor.lastName}`.trim() } : null,
      })),
      pagination: { page: query.data.page, pageSize: query.data.pageSize, total },
    });
  } catch (error) {
    console.error("Lead activities load failed", error);
    return noStoreJson({ error: "Unable to load lead activity right now." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const id = await getId(params);
  if (!id) return noStoreJson({ error: "Lead not found." }, { status: 404 });
  const authorization = await authorizeLead("EDIT", id);
  if (!authorization.ok) return noStoreJson({ error: "You do not have permission to add activity." }, { status: authorization.status });
  if (!hasValidAdminCsrf(request)) return noStoreJson({ error: "Invalid request token." }, { status: 403 });

  const body: unknown = await request.json().catch(() => null);
  const input = createActivitySchema.safeParse(body);
  if (!input.success) return noStoreJson({ error: "Invalid activity details." }, { status: 400 });

  try {
    const activity = await prisma.$transaction(async (tx) => {
      // A conditional write is the ownership check at commit time. It closes
      // the gap between the authorization read above and this new activity.
      const claimedLead = await tx.lead.updateMany({
        where: {
          id,
          ...leadScopeWhere(authorization.scope, authorization.session.id),
        },
        data: input.data.type === "CONTACT_ATTEMPT"
          ? { lastContactedAt: new Date() }
          : { updatedAt: new Date() },
      });
      if (claimedLead.count !== 1) {
        throw new LeadActivityMutationError("Lead not found.");
      }

      const created = await tx.leadActivity.create({
        data: {
          leadId: id,
          actorId: authorization.session.id,
          type: input.data.type,
          note: input.data.note,
        },
        include: { actor: { select: { id: true, firstName: true, lastName: true } } },
      });
      await recordLeadAdminAudit(tx, {
        actorId: authorization.session.id,
        leadId: id,
        action: input.data.type === "CONTACT_ATTEMPT" ? "LEAD_CONTACT_ATTEMPT" : "LEAD_NOTE_ADDED",
        description: `${input.data.type === "CONTACT_ATTEMPT" ? "Recorded contact attempt for" : "Added note to"} lead ${id}.`,
        metadata: { type: input.data.type },
      });
      return created;
    });
    return noStoreJson({
      activity: {
        ...activity,
        createdAt: activity.createdAt.toISOString(),
        actor: activity.actor ? { id: activity.actor.id, name: `${activity.actor.firstName} ${activity.actor.lastName}`.trim() } : null,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof LeadActivityMutationError) {
      return noStoreJson({ error: error.message }, { status: 404 });
    }
    console.error("Lead activity creation failed", error);
    return noStoreJson({ error: "Unable to add activity right now." }, { status: 500 });
  }
}
