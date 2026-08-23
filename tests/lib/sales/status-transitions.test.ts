import { describe, expect, it } from "vitest";
import {
  isClosedLeadStatus,
  LeadStatusTransitionError,
  transitionLeadStatus,
  type LeadStatusTransitionInput,
} from "@/lib/sales/status-transitions";

const now = new Date("2026-08-23T08:00:00.000Z");

function transition(overrides: Partial<LeadStatusTransitionInput> = {}) {
  return transitionLeadStatus({
    currentStatus: "NEW",
    nextStatus: "CONTACTED",
    canManage: false,
    now,
    ...overrides,
  });
}

describe("isClosedLeadStatus", () => {
  it.each([
    ["NEW", false],
    ["CONTACTED", false],
    ["QUALIFIED", false],
    ["PROPOSAL_SENT", false],
    ["NEGOTIATION", false],
    ["WON", true],
    ["LOST", true],
    ["DUPLICATE", true],
  ] as const)("returns %s for %s", (status, expected) => {
    expect(isClosedLeadStatus(status)).toBe(expected);
  });
});

describe("transitionLeadStatus", () => {
  it("rejects a transition to the current status", () => {
    expect(() => transition({ nextStatus: "NEW" })).toThrow(
      LeadStatusTransitionError
    );
    expect(() => transition({ nextStatus: "NEW" })).toThrow(
      "The lead is already in that status."
    );
  });

  it("produces an activity for an allowed forward pipeline transition", () => {
    expect(transition()).toEqual({
      data: {
        status: "CONTACTED",
        statusChangedAt: now,
      },
      activityType: "STATUS_CHANGE",
      activityNote: null,
    });
  });

  it("rejects pipeline transitions that do not move forward", () => {
    expect(() =>
      transition({ currentStatus: "CONTACTED", nextStatus: "NEW" })
    ).toThrow("That pipeline transition is not allowed.");
  });

  it("requires and normalizes a lost reason", () => {
    expect(() => transition({ nextStatus: "LOST", lostReason: "  " })).toThrow(
      "A lost reason is required."
    );

    expect(
      transition({ nextStatus: "LOST", lostReason: "  Budget was unavailable  " })
    ).toEqual({
      data: {
        status: "LOST",
        statusChangedAt: now,
        lostReason: "Budget was unavailable",
        lostAt: now,
        wonAt: null,
      },
      activityType: "STATUS_CHANGE",
      activityNote: null,
    });
  });

  it("records a won timestamp and clears loss details", () => {
    expect(
      transition({ currentStatus: "PROPOSAL_SENT", nextStatus: "WON" })
    ).toEqual({
      data: {
        status: "WON",
        statusChangedAt: now,
        wonAt: now,
        lostAt: null,
        lostReason: null,
      },
      activityType: "STATUS_CHANGE",
      activityNote: null,
    });
  });

  it("allows only managers to mark a lead duplicate and requires a canonical lead", () => {
    expect(() =>
      transition({ nextStatus: "DUPLICATE", duplicateOfId: "lead-123" })
    ).toThrow("Only a manager can mark a lead as duplicate.");

    expect(() =>
      transition({
        nextStatus: "DUPLICATE",
        canManage: true,
        duplicateOfId: "  ",
      })
    ).toThrow("A canonical lead is required when marking a duplicate.");

    expect(
      transition({
        nextStatus: "DUPLICATE",
        canManage: true,
        duplicateOfId: "  lead-123  ",
      })
    ).toEqual({
      data: {
        status: "DUPLICATE",
        duplicateOfId: "lead-123",
        statusChangedAt: now,
        lostReason: null,
        lostAt: null,
        wonAt: null,
      },
      activityType: "MARKED_DUPLICATE",
      activityNote: null,
    });
  });

  it("enforces manager authorization and valid inputs when reopening", () => {
    expect(() =>
      transition({
        currentStatus: "WON",
        nextStatus: "NEW",
        reopenReason: "Re-engaged by the customer",
      })
    ).toThrow("Only a manager can reopen a closed lead.");

    expect(() =>
      transition({
        currentStatus: "LOST",
        nextStatus: "NEW",
        canManage: true,
        reopenReason: "  ",
      })
    ).toThrow("A reason is required to reopen a closed lead.");

    expect(() =>
      transition({
        currentStatus: "LOST",
        nextStatus: "WON",
        canManage: true,
        reopenReason: "Customer has renewed interest",
      })
    ).toThrow("Choose an active pipeline stage when reopening a lead.");
  });

  it("clears closed-lead fields and records a normalized reopen reason", () => {
    expect(
      transition({
        currentStatus: "DUPLICATE",
        nextStatus: "QUALIFIED",
        canManage: true,
        reopenReason: "  Canonical lead was incorrect  ",
      })
    ).toEqual({
      data: {
        status: "QUALIFIED",
        statusChangedAt: now,
        wonAt: null,
        lostAt: null,
        lostReason: null,
        duplicateOfId: null,
      },
      activityType: "STATUS_CHANGE",
      activityNote: "Canonical lead was incorrect",
    });
  });
});
