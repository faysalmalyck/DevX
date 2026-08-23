import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { authorizeLead, leadScopeWhere } from "@/lib/auth/lead-authorization";
import { prisma } from "@/lib/db/prisma";
import { SALES_OWNER_ROLE_NAMES } from "@/lib/sales/agents";
import { recordLeadAdminAudit } from "@/lib/sales/audit";

const idSchema = z.string().trim().min(1).max(128);
const updateSchema = z
  .object({
    dueAt: z.string().datetime({ offset: true }).optional(),
    note: z.string().trim().max(5000).nullable().optional().transform((value) => value === undefined ? undefined : value?.trim() || null),
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
    assignedAgentId: z.string().trim().min(1).max(128).optional(),
  })
  .strict()
  .refine((value) => Object.values(value).some((item) => item !== undefined), { message: "At least one change is required." });

type RouteContext = { params: Promise<{ id: string }> };

class FollowUpUpdateError extends Error {
  constructor(message: string, readonly status: 403 | 404 | 409 | 422) {
    super(message);
    this.name = "FollowUpUpdateError";
  }
}

function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id: rawId } = await params;
  const id = idSchema.safeParse(rawId);
  if (!id.success) return noStoreJson({ error: "Follow-up not found." }, { status: 404 });

  try {
    // This first lookup only obtains the parent ID needed for central
    // authorization. The transaction below scopes the actual mutable record.
    const preliminary = await prisma.leadFollowUp.findUnique({
      where: { id: id.data },
      select: {
        leadId: true,
        deletedAt: true,
        lead: { select: { deletedAt: true } },
      },
    });
    if (!preliminary || preliminary.deletedAt || preliminary.lead.deletedAt) {
      return noStoreJson({ error: "Follow-up not found." }, { status: 404 });
    }
    const authorization = await authorizeLead("EDIT", preliminary.leadId);
    if (!authorization.ok) return noStoreJson({ error: "You do not have permission to update this follow-up." }, { status: authorization.status });
    if (!hasValidAdminCsrf(request)) return noStoreJson({ error: "Invalid request token." }, { status: 403 });
    const body: unknown = await request.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return noStoreJson({ error: "Invalid follow-up update." }, { status: 400 });
    const input = parsed.data;

    const dueAt = input.dueAt ? new Date(input.dueAt) : undefined;
    if (dueAt && Number.isNaN(dueAt.getTime())) return noStoreJson({ error: "Invalid follow-up date." }, { status: 400 });

    const followUp = await prisma.$transaction(async (tx) => {
      const existing = await tx.leadFollowUp.findFirst({
        where: {
          id: id.data,
          deletedAt: null,
          lead: leadScopeWhere(authorization.scope, authorization.session.id),
        },
        select: {
          id: true,
          leadId: true,
          assignedAgentId: true,
          status: true,
          lead: { select: { assignedAgentId: true } },
        },
      });
      if (!existing) throw new FollowUpUpdateError("Follow-up not found.", 404);

      const canManage = authorization.scope === "ALL";
      if (!canManage && input.assignedAgentId !== undefined) {
        throw new FollowUpUpdateError("Only a manager can reassign a follow-up.", 403);
      }
      if (!canManage && existing.assignedAgentId !== authorization.session.id) {
        throw new FollowUpUpdateError("You do not have permission to update this follow-up.", 403);
      }

      let targetAgentId = existing.assignedAgentId;
      if (input.assignedAgentId !== undefined) {
        targetAgentId = input.assignedAgentId;
        const target = await tx.admin.findFirst({
          where: {
            id: targetAgentId,
            status: "ACTIVE",
            deletedAt: null,
            role: { name: { in: [...SALES_OWNER_ROLE_NAMES] } },
          },
          select: { id: true },
        });
        if (!target || existing.lead.assignedAgentId !== targetAgentId) {
          throw new FollowUpUpdateError("Follow-ups must be assigned to the lead's active Sales owner.", 422);
        }
      }

      const nextStatus = input.status ?? existing.status;
      const completedAt = input.status === "COMPLETED"
        ? new Date()
        : input.status === "PENDING" || input.status === "CANCELLED"
          ? null
          : undefined;

      // Make the parent lead ownership/current assignee part of the write
      // condition. A former owner cannot update a follow-up after a race.
      const claimedLead = await tx.lead.updateMany({
        where: {
          id: existing.leadId,
          deletedAt: null,
          assignedAgentId: existing.lead.assignedAgentId,
        },
        data: { updatedAt: new Date() },
      });
      if (claimedLead.count !== 1) {
        throw new FollowUpUpdateError("The lead changed before the follow-up could be saved. Refresh and try again.", 409);
      }

      const changed = await tx.leadFollowUp.updateMany({
        where: {
          id: existing.id,
          deletedAt: null,
          status: existing.status,
          assignedAgentId: existing.assignedAgentId,
        },
        data: {
          ...(dueAt ? { dueAt } : {}),
          ...(input.note !== undefined ? { note: input.note } : {}),
          ...(input.status !== undefined ? { status: input.status, completedAt } : {}),
          ...(targetAgentId !== existing.assignedAgentId ? { assignedAgentId: targetAgentId } : {}),
        },
      });
      if (changed.count !== 1) {
        throw new FollowUpUpdateError("The follow-up changed before the update could be saved. Refresh and try again.", 409);
      }
      const updated = await tx.leadFollowUp.findUnique({ where: { id: existing.id } });
      if (!updated) throw new FollowUpUpdateError("Follow-up not found.", 404);

      const type = input.status === "COMPLETED" ? "FOLLOW_UP_COMPLETED" : "NOTE";
      await tx.leadActivity.create({
        data: {
          leadId: existing.leadId,
          actorId: authorization.session.id,
          type,
          note: input.status === "CANCELLED" ? "Follow-up cancelled." : null,
          metadata: {
            followUpId: existing.id,
            oldStatus: existing.status,
            newStatus: nextStatus,
            oldAssignedAgentId: existing.assignedAgentId,
            newAssignedAgentId: targetAgentId,
          },
        },
      });
      await recordLeadAdminAudit(tx, {
        actorId: authorization.session.id,
        leadId: existing.leadId,
        action: input.status === "COMPLETED" ? "FOLLOW_UP_COMPLETED" : input.status === "CANCELLED" ? "FOLLOW_UP_CANCELLED" : targetAgentId !== existing.assignedAgentId ? "FOLLOW_UP_REASSIGNED" : "FOLLOW_UP_UPDATED",
        description: `Updated follow-up ${existing.id} for lead ${existing.leadId}.`,
        metadata: {
          followUpId: existing.id,
          oldStatus: existing.status,
          newStatus: nextStatus,
          oldAssignedAgentId: existing.assignedAgentId,
          newAssignedAgentId: targetAgentId,
        },
      });
      return updated;
    });

    return noStoreJson({
      followUp: {
        ...followUp,
        dueAt: followUp.dueAt.toISOString(),
        completedAt: followUp.completedAt?.toISOString() ?? null,
        createdAt: followUp.createdAt.toISOString(),
        updatedAt: followUp.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof FollowUpUpdateError) {
      return noStoreJson({ error: error.message }, { status: error.status });
    }
    console.error("Follow-up update failed", error);
    return noStoreJson({ error: "Unable to update this follow-up right now." }, { status: 500 });
  }
}
