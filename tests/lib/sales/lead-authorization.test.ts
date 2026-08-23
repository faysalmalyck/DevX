import { describe, expect, it } from "vitest";

import { leadScopeWhere } from "@/lib/auth/lead-authorization";

describe("leadScopeWhere", () => {
  it("uses current assignment, never lead provenance, for an agent scope", () => {
    expect(leadScopeWhere("OWN", "agent-123")).toEqual({
      assignedAgentId: "agent-123",
      deletedAt: null,
    });
  });

  it("keeps manager scope limited to active (non-deleted) leads", () => {
    expect(leadScopeWhere("ALL", "manager-123")).toEqual({
      deletedAt: null,
    });
  });
});
