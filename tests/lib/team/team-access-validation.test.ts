import { describe, expect, it } from "vitest";

import {
  teamMemberSalesSchema,
  teamMemberSchema,
} from "@/lib/validations/team";

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

  it("accepts optional profile-page content for Team administrator requests", () => {
    const result = teamMemberSchema.safeParse({
      ...base,
      about: "  Avery leads early discovery and relationships with new partners.  ",
      highlights: ["  Pipeline strategy  ", "Client discovery"],
      experience: "  Avery has supported sales teams across several markets.  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject({
        about: "Avery leads early discovery and relationships with new partners.",
        highlights: ["Pipeline strategy", "Client discovery"],
        experience: "Avery has supported sales teams across several markets.",
      });
    }
  });

  it("rejects detailed profile content submitted through the Sales editor", () => {
    const result = teamMemberSalesSchema.safeParse({
      ...base,
      about: "Sales users must not replace the team-authored About section.",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === "about")).toBe(true);
  });
});
