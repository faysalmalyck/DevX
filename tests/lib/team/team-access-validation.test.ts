import { describe, expect, it } from "vitest";

import { teamMemberSchema } from "@/lib/validations/team";

const base = {
  name: "Avery Patel",
  slug: "avery-patel",
  role: "Business Development Executive",
  department: "SALES",
  bio: "A complete team profile with enough descriptive context.",
  email: "avery@example.com",
  accessRole: "SALES_AGENT",
  salesRole: "SALES_AGENT",
  status: "DRAFT",
  displayOrder: 0,
  featured: false,
};

describe("TeamMember Access & Role validation", () => {
  it("accepts the controlled Sales Agent choice", () => {
    expect(teamMemberSchema.safeParse(base).success).toBe(true);
  });

  it("maps no login access without requiring a work email", () => {
    const result = teamMemberSchema.safeParse({
      ...base,
      role: "Designer",
      department: "ENGINEERING",
      email: null,
      accessRole: "NONE",
      salesRole: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects Sales access outside the Sales department", () => {
    const result = teamMemberSchema.safeParse({ ...base, department: "ENGINEERING" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === "department")).toBe(true);
  });
});
