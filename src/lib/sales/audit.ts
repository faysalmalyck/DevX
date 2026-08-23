import type { Prisma } from "@prisma/client";

type LeadAuditInput = {
  actorId: string;
  leadId: string;
  action: string;
  description: string;
  metadata?: Prisma.InputJsonValue;
};

/**
 * Uses the existing AdminActivity and AuditLog records while allowing a lead
 * mutation to commit its domain activity and audit records in one transaction.
 */
export async function recordLeadAdminAudit(
  tx: Prisma.TransactionClient,
  input: LeadAuditInput
) {
  await Promise.all([
    tx.adminActivity.create({
      data: {
        adminId: input.actorId,
        action: input.action,
        module: "Leads",
        description: input.description,
      },
    }),
    tx.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entity: "Lead",
        entityId: input.leadId,
        metadata: input.metadata,
      },
    }),
  ]);
}
