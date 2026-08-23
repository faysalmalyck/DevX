import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { authorizeLead, leadScopeWhere } from "@/lib/auth/lead-authorization";
import { prisma } from "@/lib/db/prisma";
import { SALES_OWNER_ROLE_NAMES } from "@/lib/sales/agents";
import { recordLeadAdminAudit } from "@/lib/sales/audit";
import {
  LeadStatusTransitionError,
  transitionLeadStatus,
} from "@/lib/sales/status-transitions";

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

const idSchema = z.string().trim().min(1).max(128);
const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .nullable()
    .optional()
    .transform((value) => value === undefined ? undefined : value?.trim() || null);
const patchSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120).optional(),
    email: z.string().trim().toLowerCase().email().max(320).optional(),
    phone: z
      .string()
      .trim()
      .max(32)
      .nullable()
      .optional()
      .transform((value) => value === undefined ? undefined : value?.trim() || null),
    company: optionalText(160),
    message: optionalText(5000),
    budgetRange: optionalText(120),
    estimatedValue: z.coerce.number().finite().min(0).max(9999999999.99).nullable().optional(),
    status: z.enum(leadStatuses).optional(),
    lostReason: optionalText(1000),
    reopenReason: z.string().trim().max(1000).optional(),
    duplicateOfId: z.string().trim().min(1).max(128).optional(),
    assignedAgentId: z.string().trim().min(1).max(128).nullable().optional(),
  })
  .strict()
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one change is required.",
  });

type RouteContext = { params: Promise<{ id: string }> };

class LeadMutationError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 404 | 409 | 422
  ) {
    super(message);
    this.name = "LeadMutationError";
  }
}

function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

async function parseId(params: RouteContext["params"]): Promise<string | null> {
  const { id } = await params;
  const parsed = idSchema.safeParse(id);
  return parsed.success ? parsed.data : null;
}

function serializeLead(lead: {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  budgetRange: string | null;
  estimatedValue: { toString(): string } | null;
  status: string;
  source: string;
  captureSurface: string | null;
  referralAgentCode: string | null;
  lostReason: string | null;
  statusChangedAt: Date;
  lastContactedAt: Date | null;
  wonAt: Date | null;
  lostAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  assignedAgent: { id: string; firstName: string; lastName: string; agentCode: string | null } | null;
  referralAgent: { id: string; firstName: string; lastName: string; agentCode: string | null } | null;
  activities: Array<{ id: string; type: string; note: string | null; metadata: unknown; createdAt: Date; actor: { id: string; firstName: string; lastName: string } | null }>;
  followUps: Array<{ id: string; dueAt: Date; status: string; note: string | null; completedAt: Date | null; assignedAgent: { id: string; firstName: string; lastName: string } }>;
}) {
  return {
    ...lead,
    estimatedValue: lead.estimatedValue?.toString() ?? null,
    statusChangedAt: lead.statusChangedAt.toISOString(),
    lastContactedAt: lead.lastContactedAt?.toISOString() ?? null,
    wonAt: lead.wonAt?.toISOString() ?? null,
    lostAt: lead.lostAt?.toISOString() ?? null,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
    assignedAgent: lead.assignedAgent ? { id: lead.assignedAgent.id, name: `${lead.assignedAgent.firstName} ${lead.assignedAgent.lastName}`.trim(), agentCode: lead.assignedAgent.agentCode } : null,
    referralAgent: lead.referralAgent ? { id: lead.referralAgent.id, name: `${lead.referralAgent.firstName} ${lead.referralAgent.lastName}`.trim(), agentCode: lead.referralAgent.agentCode } : null,
    activities: lead.activities.map((activity) => ({
      ...activity,
      createdAt: activity.createdAt.toISOString(),
      actor: activity.actor ? { id: activity.actor.id, name: `${activity.actor.firstName} ${activity.actor.lastName}`.trim() } : null,
    })),
    followUps: lead.followUps.map((followUp) => ({
      ...followUp,
      dueAt: followUp.dueAt.toISOString(),
      completedAt: followUp.completedAt?.toISOString() ?? null,
      assignedAgent: { id: followUp.assignedAgent.id, name: `${followUp.assignedAgent.firstName} ${followUp.assignedAgent.lastName}`.trim() },
    })),
  };
}

const detailInclude = {
  assignedAgent: { select: { id: true, firstName: true, lastName: true, agentCode: true } },
  referralAgent: { select: { id: true, firstName: true, lastName: true, agentCode: true } },
  activities: {
    orderBy: { createdAt: "desc" as const },
    take: 100,
    include: { actor: { select: { id: true, firstName: true, lastName: true } } },
  },
  followUps: {
    where: { deletedAt: null },
    orderBy: { dueAt: "asc" as const },
    include: { assignedAgent: { select: { id: true, firstName: true, lastName: true } } },
  },
} as const;

export async function GET(_: NextRequest, { params }: RouteContext) {
  const id = await parseId(params);
  if (!id) return noStoreJson({ error: "Lead not found." }, { status: 404 });

  const authorization = await authorizeLead("VIEW", id);
  if (!authorization.ok) {
    return noStoreJson(
      { error: authorization.status === 404 ? "Lead not found." : "You do not have access to this lead." },
      { status: authorization.status }
    );
  }

  try {
    const lead = await prisma.lead.findFirst({
      where: { id, ...leadScopeWhere(authorization.scope, authorization.session.id) },
      include: detailInclude,
    });
    if (!lead) return noStoreJson({ error: "Lead not found." }, { status: 404 });
    return noStoreJson({ lead: serializeLead(lead) });
  } catch (error) {
    console.error("Lead detail load failed", error);
    return noStoreJson({ error: "Unable to load this lead right now." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const id = await parseId(params);
  if (!id) return noStoreJson({ error: "Lead not found." }, { status: 404 });

  const authorization = await authorizeLead("EDIT", id);
  if (!authorization.ok) {
    return noStoreJson(
      { error: authorization.status === 404 ? "Lead not found." : "You do not have permission to update this lead." },
      { status: authorization.status }
    );
  }
  if (!hasValidAdminCsrf(request)) return noStoreJson({ error: "Invalid request token." }, { status: 403 });

  const body: unknown = await request.json().catch(() => null);
  const parsedBody = patchSchema.safeParse(body);
  if (!parsedBody.success) return noStoreJson({ error: "Invalid lead update." }, { status: 400 });
  const input = parsedBody.data;
  const canManage = authorization.scope === "ALL";

  if (
    !canManage &&
    (input.assignedAgentId !== undefined || input.duplicateOfId !== undefined || input.reopenReason !== undefined)
  ) {
    return noStoreJson({ error: "This change requires sales management access." }, { status: 403 });
  }
  if (!input.status && (input.lostReason !== undefined || input.reopenReason !== undefined || input.duplicateOfId !== undefined)) {
    return noStoreJson({ error: "Status transition fields require a status update." }, { status: 400 });
  }

  const changedFields = [
    "fullName",
    "email",
    "phone",
    "company",
    "message",
    "budgetRange",
    "estimatedValue",
  ].filter((field) => input[field as keyof typeof input] !== undefined);

  try {
    const updated = await prisma.$transaction(async (tx) => {
      // Authorization is intentionally re-applied inside the transaction.
      // The earlier check is for prompt responses; this query and the guarded
      // update prevent a previous owner from winning a reassignment race.
      const lead = await tx.lead.findFirst({
        where: {
          id,
          ...leadScopeWhere(authorization.scope, authorization.session.id),
        },
        select: {
          id: true,
          status: true,
          assignedAgentId: true,
        },
      });
      if (!lead) throw new LeadMutationError("Lead not found.", 404);

      let targetAssignment = lead.assignedAgentId;
      if (input.assignedAgentId !== undefined) {
        targetAssignment = input.assignedAgentId;
        if (targetAssignment) {
          const target = await tx.admin.findFirst({
            where: {
              id: targetAssignment,
              status: "ACTIVE",
              deletedAt: null,
              role: { name: { in: [...SALES_OWNER_ROLE_NAMES] } },
            },
            select: { id: true },
          });
          if (!target) {
            throw new LeadMutationError("Choose an active Sales owner for assignment.", 422);
          }
        }
      }

      let transition: ReturnType<typeof transitionLeadStatus> | null = null;
      if (input.status) {
        try {
          transition = transitionLeadStatus({
            currentStatus: lead.status,
            nextStatus: input.status,
            canManage,
            lostReason: input.lostReason,
            reopenReason: input.reopenReason,
            duplicateOfId: input.duplicateOfId,
          });
        } catch (transitionError) {
          throw new LeadMutationError(
            transitionError instanceof LeadStatusTransitionError
              ? transitionError.message
              : "Invalid status transition.",
            422
          );
        }

        if (input.status === "DUPLICATE" && input.duplicateOfId) {
          const canonical = await tx.lead.findUnique({
            where: { id: input.duplicateOfId },
            select: { id: true, status: true, duplicateOfId: true, deletedAt: true },
          });
          if (!canonical || canonical.deletedAt || canonical.id === id || canonical.status === "DUPLICATE" || canonical.duplicateOfId === id) {
            throw new LeadMutationError("Choose a valid canonical lead.", 422);
          }
        }
      }

      if (input.assignedAgentId === null) {
        const pendingFollowUps = await tx.leadFollowUp.count({
          where: { leadId: id, deletedAt: null, status: "PENDING" },
        });
        if (pendingFollowUps > 0) {
          throw new LeadMutationError("Reassign pending follow-ups before unassigning this lead.", 422);
        }
      }

      const assignmentChanged = input.assignedAgentId !== undefined && targetAssignment !== lead.assignedAgentId;
      if (!assignmentChanged && !transition && changedFields.length === 0) {
        throw new LeadMutationError("No lead changes were supplied.", 400);
      }

      const changed = await tx.lead.updateMany({
        where: {
          id: lead.id,
          deletedAt: null,
          status: lead.status,
          assignedAgentId: lead.assignedAgentId,
        },
        data: {
          ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
          ...(input.email !== undefined ? { email: input.email } : {}),
          ...(input.phone !== undefined ? { phone: input.phone } : {}),
          ...(input.company !== undefined ? { company: input.company } : {}),
          ...(input.message !== undefined ? { message: input.message } : {}),
          ...(input.budgetRange !== undefined ? { budgetRange: input.budgetRange } : {}),
          ...(input.estimatedValue !== undefined ? { estimatedValue: input.estimatedValue } : {}),
          ...(assignmentChanged ? { assignedAgentId: targetAssignment } : {}),
          ...(transition?.data ?? {}),
        },
      });
      if (changed.count !== 1) {
        throw new LeadMutationError("The lead changed before the update could be saved. Refresh and try again.", 409);
      }

      if (assignmentChanged) {
        if (targetAssignment) {
          await tx.leadFollowUp.updateMany({
            where: { leadId: id, deletedAt: null, status: "PENDING" },
            data: { assignedAgentId: targetAssignment },
          });
        }
        await tx.leadActivity.create({
          data: {
            leadId: id,
            actorId: authorization.session.id,
            type: "ASSIGNMENT",
            metadata: { oldAssignedAgentId: lead.assignedAgentId, newAssignedAgentId: targetAssignment },
          },
        });
      }
      if (transition) {
        await tx.leadActivity.create({
          data: {
            leadId: id,
            actorId: authorization.session.id,
            type: transition.activityType,
            note: transition.activityNote,
            metadata: { oldStatus: lead.status, newStatus: input.status },
          },
        });
      }
      if (changedFields.length > 0) {
        await tx.leadActivity.create({
          data: {
            leadId: id,
            actorId: authorization.session.id,
            type: "NOTE",
            note: "Lead details updated.",
            metadata: { fields: changedFields },
          },
        });
      }
      await recordLeadAdminAudit(tx, {
        actorId: authorization.session.id,
        leadId: id,
        action: transition ? "LEAD_STATUS_UPDATED" : assignmentChanged ? "LEAD_REASSIGNED" : "LEAD_UPDATED",
        description: `Updated lead ${id}.`,
        metadata: {
          fields: changedFields,
          oldStatus: lead.status,
          newStatus: input.status ?? lead.status,
          oldAssignedAgentId: lead.assignedAgentId,
          newAssignedAgentId: targetAssignment,
        },
      });

      const result = await tx.lead.findUnique({ where: { id }, include: detailInclude });
      if (!result) throw new LeadMutationError("Lead not found.", 404);
      return result;
    });

    return noStoreJson({ lead: serializeLead(updated) });
  } catch (error) {
    if (error instanceof LeadMutationError) {
      return noStoreJson({ error: error.message }, { status: error.status });
    }
    console.error("Lead update failed", error);
    return noStoreJson({ error: "Unable to update this lead right now." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const id = await parseId(params);
  if (!id) return noStoreJson({ error: "Lead not found." }, { status: 404 });
  const authorization = await authorizeLead("DELETE", id);
  if (!authorization.ok) {
    return noStoreJson(
      { error: authorization.status === 404 ? "Lead not found." : "You do not have permission to remove this lead." },
      { status: authorization.status }
    );
  }
  if (!hasValidAdminCsrf(request)) return noStoreJson({ error: "Invalid request token." }, { status: 403 });

  try {
    await prisma.$transaction(async (tx) => {
      const deleted = await tx.lead.updateMany({
        where: { id, ...leadScopeWhere(authorization.scope, authorization.session.id) },
        data: { deletedAt: new Date() },
      });
      if (deleted.count !== 1) throw new LeadMutationError("Lead not found.", 404);
      await tx.leadActivity.create({
        data: {
          leadId: id,
          actorId: authorization.session.id,
          type: "NOTE",
          note: "Lead soft-deleted.",
        },
      });
      await recordLeadAdminAudit(tx, {
        actorId: authorization.session.id,
        leadId: id,
        action: "LEAD_DELETED",
        description: `Soft-deleted lead ${id}.`,
      });
    });
    return noStoreJson({ success: true });
  } catch (error) {
    if (error instanceof LeadMutationError) {
      return noStoreJson({ error: error.message }, { status: error.status });
    }
    console.error("Lead deletion failed", error);
    return noStoreJson({ error: "Unable to remove this lead right now." }, { status: 500 });
  }
}
