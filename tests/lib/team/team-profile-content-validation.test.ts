import { describe, expect, it } from "vitest";

import { deriveTeamMemberProfileStatus } from "@/lib/team/profile-status";
import { serializeSalesTeamMember } from "@/lib/team/sales-serialization";
import { serializeTeamMember } from "@/lib/team/types";
import {
  teamMemberSalesSchema,
  teamMemberSchema,
} from "@/lib/validations/team";

const directoryProfile = {
  name: "Avery Patel",
  slug: "avery-patel",
  role: "Principal Engineer",
  department: "ENGINEERING",
  bio: "Avery leads the engineering team and maintains the developer platform.",
  email: "avery@example.com",
  accessRole: "NONE",
  salesRole: null,
  status: "PUBLISHED",
  displayOrder: 0,
  featured: false,
};

const salesProfile = {
  name: "Avery Patel",
  slug: "avery-patel",
  role: "Business Development Executive",
  department: "SALES",
  bio: "Avery builds trusted relationships and creates useful commercial opportunities.",
  email: "avery@example.com",
  accessRole: "SALES_AGENT",
  salesRole: "SALES_AGENT",
  status: "PUBLISHED",
  displayOrder: 0,
  featured: false,
};

describe("team profile content validation", () => {
  it("normalizes optional profile content without changing directory completeness", () => {
    const parsed = teamMemberSchema.parse({
      ...directoryProfile,
      about: "  Avery leads thoughtful technical strategy across the organization.  ",
      aboutParagraph2: "  Avery also oversees architecture across platform services.  ",
      highlights: ["  Platform strategy  ", "Developer experience"],
      experience: "  Avery has led product and platform teams for more than a decade.  ",
    });

    expect(parsed.about).toBe("Avery leads thoughtful technical strategy across the organization.");
    expect(parsed.aboutParagraph2).toBe("Avery also oversees architecture across platform services.");
    expect(parsed.highlights).toEqual(["Platform strategy", "Developer experience"]);
    expect(parsed.experience).toBe("Avery has led product and platform teams for more than a decade.");
    expect(deriveTeamMemberProfileStatus(parsed)).toBe("COMPLETE");
  });

  it("defaults omitted detail content while keeping a complete directory profile publishable", () => {
    const parsed = teamMemberSchema.parse(directoryProfile);

    expect(parsed.about).toBeNull();
    expect(parsed.aboutParagraph2).toBeNull();
    expect(parsed.highlights).toEqual([]);
    expect(parsed.experience).toBeNull();
    expect(deriveTeamMemberProfileStatus(parsed)).toBe("COMPLETE");
  });

  it("rejects blank or excessive profile highlights", () => {
    const blank = teamMemberSchema.safeParse({
      ...directoryProfile,
      highlights: ["   "],
    });
    const excessive = teamMemberSchema.safeParse({
      ...directoryProfile,
      highlights: Array.from({ length: 13 }, (_, index) => `Highlight ${index + 1}`),
    });

    expect(blank.success).toBe(false);
    expect(blank.error?.issues.some((issue) => issue.path[0] === "highlights")).toBe(true);
    expect(excessive.success).toBe(false);
    expect(excessive.error?.issues.some((issue) => issue.path[0] === "highlights")).toBe(true);
  });

  it("rejects long-form profile writes from the Sales editor", () => {
    for (const [field, value] of Object.entries({
      about: "Sales users cannot edit this.",
      aboutParagraph2: "Sales users cannot edit this.",
      highlights: ["Sales users cannot edit this."],
      experience: "Sales users cannot edit this.",
    })) {
      const parsed = teamMemberSalesSchema.safeParse({
        ...salesProfile,
        [field]: value,
      });

      expect(parsed.success).toBe(false);
      expect(parsed.error?.issues.some((issue) => issue.path[0] === field)).toBe(true);
    }
  });

  it("allows the Sales editor to round-trip unrelated response-only fields", () => {
    const parsed = teamMemberSalesSchema.safeParse({
      ...salesProfile,
      admin: { username: "avery", status: "ACTIVE" },
    });

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data).not.toHaveProperty("admin");
    expect(parsed.data.about).toBeUndefined();
    expect(parsed.data.aboutParagraph2).toBeUndefined();
    expect(parsed.data.highlights).toBeUndefined();
    expect(parsed.data.experience).toBeUndefined();
  });

  it("keeps Sales API records free of long-form fields so updates preserve them", () => {
    const source: Parameters<typeof serializeTeamMember>[0] = {
      id: "team-avery-patel",
      name: "Avery Patel",
      slug: "avery-patel",
      role: "Business Development Executive",
      department: "SALES",
      legacyDepartment: null,
      bio: "Avery builds trusted relationships and creates useful commercial opportunities.",
      about: "A Team administrator authored this long-form profile.",
      aboutParagraph2: "Second paragraph content from administrator.",
      highlights: ["Strategic accounts", "Trusted discovery"],
      experience: "Avery has extensive commercial experience.",
      image: null,
      email: "avery@example.com",
      accessRole: "SALES_AGENT",
      salesRole: "SALES_AGENT",
      adminId: "admin-avery",
      phone: null,
      linkedinUrl: null,
      facebookUrl: null,
      twitterUrl: null,
      githubUrl: null,
      displayOrder: 0,
      featured: false,
      status: "PUBLISHED",
      profileStatus: "COMPLETE",
      createdAt: new Date("2026-09-02T00:00:00.000Z"),
      updatedAt: new Date("2026-09-02T00:00:00.000Z"),
    };

    const serialized = serializeSalesTeamMember(source);

    expect(serialized).toMatchObject({
      id: source.id,
      slug: source.slug,
      bio: source.bio,
    });
    expect(serialized).not.toHaveProperty("about");
    expect(serialized).not.toHaveProperty("aboutParagraph2");
    expect(serialized).not.toHaveProperty("highlights");
    expect(serialized).not.toHaveProperty("experience");
  });
});
