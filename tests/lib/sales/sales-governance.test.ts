import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({
  getActiveSession: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {},
}));

import {
  isSalesGovernanceRole,
  isSalesRole,
} from "@/lib/auth/sales-governance";

describe("sales governance policy", () => {
  it("keeps daily sales roles out of the Admin workspace", () => {
    expect(isSalesRole("Sales Agent")).toBe(true);
    expect(isSalesRole("Sales Manager")).toBe(true);
    expect(isSalesRole("Administrator")).toBe(false);
  });

  it("limits Sales Management governance to CEO and Super Admin", () => {
    expect(
      isSalesGovernanceRole({ name: "CEO", isSuperAdmin: false })
    ).toBe(true);
    expect(
      isSalesGovernanceRole({ name: "Custom Executive", isSuperAdmin: true })
    ).toBe(true);
    expect(
      isSalesGovernanceRole({ name: "Sales Manager", isSuperAdmin: false })
    ).toBe(false);
  });
});
