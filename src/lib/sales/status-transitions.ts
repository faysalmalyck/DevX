import type { LeadStatus, Prisma } from "@prisma/client";

const forwardTransitions: Record<
  Exclude<LeadStatus, "WON" | "LOST" | "DUPLICATE">,
  readonly LeadStatus[]
> = {
  NEW: ["CONTACTED", "QUALIFIED", "LOST"],
  CONTACTED: ["QUALIFIED", "LOST"],
  QUALIFIED: ["PROPOSAL_SENT", "NEGOTIATION", "LOST"],
  PROPOSAL_SENT: ["NEGOTIATION", "WON", "LOST"],
  NEGOTIATION: ["WON", "LOST"],
};

const closedStatuses: readonly LeadStatus[] = ["WON", "LOST", "DUPLICATE"];
const reopenTargets: readonly LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
];

export class LeadStatusTransitionError extends Error {}

export type LeadStatusTransitionInput = {
  currentStatus: LeadStatus;
  nextStatus: LeadStatus;
  canManage: boolean;
  lostReason?: string | null;
  reopenReason?: string | null;
  duplicateOfId?: string | null;
  now?: Date;
};

export type LeadStatusTransition = {
  data: Prisma.LeadUncheckedUpdateInput;
  activityType: "STATUS_CHANGE" | "MARKED_DUPLICATE";
  activityNote: string | null;
};

function cleanReason(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed || null;
}

export function isClosedLeadStatus(status: LeadStatus): boolean {
  return closedStatuses.includes(status);
}

function hasForwardTransitions(
  status: LeadStatus
): status is keyof typeof forwardTransitions {
  return status in forwardTransitions;
}

/**
 * Produces one canonical, validated status update. Database checks such as the
 * canonical duplicate target belong to the route/service that owns the
 * transaction, while all transition rules live here.
 */
export function transitionLeadStatus(
  input: LeadStatusTransitionInput
): LeadStatusTransition {
  const now = input.now ?? new Date();
  const lostReason = cleanReason(input.lostReason);
  const reopenReason = cleanReason(input.reopenReason);

  if (input.currentStatus === input.nextStatus) {
    throw new LeadStatusTransitionError("The lead is already in that status.");
  }

  if (input.nextStatus === "DUPLICATE") {
    if (!input.canManage) {
      throw new LeadStatusTransitionError("Only a manager can mark a lead as duplicate.");
    }

    if (!input.duplicateOfId?.trim()) {
      throw new LeadStatusTransitionError("A canonical lead is required when marking a duplicate.");
    }

    return {
      data: {
        status: "DUPLICATE",
        duplicateOfId: input.duplicateOfId.trim(),
        statusChangedAt: now,
        lostReason: null,
        lostAt: null,
        wonAt: null,
      },
      activityType: "MARKED_DUPLICATE",
      activityNote: null,
    };
  }

  if (isClosedLeadStatus(input.currentStatus)) {
    if (!input.canManage) {
      throw new LeadStatusTransitionError("Only a manager can reopen a closed lead.");
    }

    if (!reopenReason) {
      throw new LeadStatusTransitionError("A reason is required to reopen a closed lead.");
    }

    if (!reopenTargets.includes(input.nextStatus)) {
      throw new LeadStatusTransitionError("Choose an active pipeline stage when reopening a lead.");
    }

    return {
      data: {
        status: input.nextStatus,
        statusChangedAt: now,
        wonAt: null,
        lostAt: null,
        lostReason: null,
        duplicateOfId: null,
      },
      activityType: "STATUS_CHANGE",
      activityNote: reopenReason,
    };
  }

  if (
    !hasForwardTransitions(input.currentStatus) ||
    !forwardTransitions[input.currentStatus].includes(input.nextStatus)
  ) {
    throw new LeadStatusTransitionError("That pipeline transition is not allowed.");
  }

  if (input.nextStatus === "LOST") {
    if (!lostReason) {
      throw new LeadStatusTransitionError("A lost reason is required.");
    }

    return {
      data: {
        status: "LOST",
        statusChangedAt: now,
        lostReason,
        lostAt: now,
        wonAt: null,
      },
      activityType: "STATUS_CHANGE",
      activityNote: null,
    };
  }

  if (input.nextStatus === "WON") {
    return {
      data: {
        status: "WON",
        statusChangedAt: now,
        wonAt: now,
        lostAt: null,
        lostReason: null,
      },
      activityType: "STATUS_CHANGE",
      activityNote: null,
    };
  }

  return {
    data: {
      status: input.nextStatus,
      statusChangedAt: now,
    },
    activityType: "STATUS_CHANGE",
    activityNote: null,
  };
}
