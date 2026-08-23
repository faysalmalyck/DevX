import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { authorizeLead, leadScopeWhere } from "@/lib/auth/lead-authorization";
import { prisma } from "@/lib/db/prisma";
import { SALES_OWNER_ROLE_NAMES } from "@/lib/sales/agents";
import { recordLeadAdminAudit } from "@/lib/sales/audit";

const idSchema = z.string().trim().min(1).max(128);
const createFollowUpSchema = z
  .object({
    dueAt: z.string().datetime({ offset: true }),
    note: z.string().trim().max(5000).optional().transform((value) => value || undefined),
    assignedAgentId: z.string().trim().min(1).max(128).optional(),
  })
  .strict();

type RouteContext = { params: Promise<{ id: string }> };

class FollowUpMutationError extends Error {
  constructor(message: string, readonly status: 404 | 409 | 422) {
    super(message);
    this.name = "FollowUpMutationError";
  }
}

function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id: rawId } = await params;
  const id = idSchema.safeParse(rawId);
  if (!id.success) return noStoreJson({ error: "Lead not found." }, { status: 404 });
  const authorization = await authorizeLead("EDIT", id.data);
  if (!authorization.ok) return noStoreJson({ error: "You do not have permission to create a follow-up." }, { status: authorization.status });
  if (!hasValidAdminCsrf(request)) return noStoreJson({ error: "Invalid request token." }, { status: 403 });

  const body: unknown = await request.json().catch(() => null);
  const parsed = createFollowUpSchema.safeParse(body);
  if (!parsed.success) return noStoreJson({ error: "Invalid follow-up details." }, { status: 400 });
  const dueAt = new Date(parsed.data.dueAt);
  if (Number.isNaN(dueAt.getTime())) return noStoreJson({ error: "Invalid follow-up date." }, { status: 400 });

  try {
    const followUp = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findFirst({
        where: {
          id: id.data,
          ...leadScopeWhere(authorization.scope, authorization.session.id),
        },
        select: { id: true, assignedAgentId: true },
      });
      if (!lead) throw new FollowUpMutationError("Lead not found.", 404);

      const assignedAgentId = authorization.scope === "OWN"
        ? authorization.session.id
        : parsed.data.assignedAgentId ?? lead.assignedAgentId;
      if (!assignedAgentId) {
        throw new FollowUpMutationError("Assign the lead to an active Sales owner before scheduling a follow-up.", 422);
      }
      const assignee = await tx.admin.findFirst({
        where: {
          id: assignedAgentId,
          status: "ACTIVE",
          deletedAt: null,
          role: { name: { in: [...SALES_OWNER_ROLE_NAMES] } },
        },
        select: { id: true },
      });
      if (!assignee || lead.assignedAgentId !== assignedAgentId) {
        throw new FollowUpMutationError("Follow-ups must be assigned to the lead's active Sales owner.", 422);
      }

      // Lock and re-check the current owner before adding a task. A
      // reassignment racing this request leaves no follow-up behind.
      const claimedLead = await tx.lead.updateMany({
        where: {
          id: lead.id,
          deletedAt: null,
          assignedAgentId: lead.assignedAgentId,
        },
        data: { updatedAt: new Date() },
      });
      if (claimedLead.count !== 1) {
        throw new FollowUpMutationError("The lead changed before the follow-up could be saved. Refresh and try again.", 409);
      }

      const created = await tx.leadFollowUp.create({
        data: {
          leadId: lead.id,
          assignedAgentId,
          createdById: authorization.session.id,
          dueAt,
          note: parsed.data.note ?? null,
        },
      });
      await tx.leadActivity.create({
        data: {
          leadId: lead.id,
          actorId: authorization.session.id,
          type: "FOLLOW_UP_CREATED",
          metadata: { followUpId: created.id, assignedAgentId, dueAt: dueAt.toISOString() },
        },
      });
      await recordLeadAdminAudit(tx, {
        actorId: authorization.session.id,
        leadId: lead.id,
        action: "FOLLOW_UP_CREATED",
        description: `Created follow-up ${created.id} for lead ${lead.id}.`,
        metadata: { followUpId: created.id, assignedAgentId, dueAt: dueAt.toISOString() },
      });
      return created;
    });
    return noStoreJson({
      followUp: { ...followUp, dueAt: followUp.dueAt.toISOString(), createdAt: followUp.createdAt.toISOString(), updatedAt: followUp.updatedAt.toISOString() },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof FollowUpMutationError) {
      return noStoreJson({ error: error.message }, { status: error.status });
    }
    console.error("Follow-up creation failed", error);
    return noStoreJson({ error: "Unable to create follow-up right now." }, { status: 500 });
  }
}
