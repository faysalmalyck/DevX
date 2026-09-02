import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  teamMemberFindMany: vi.fn(),
  teamMemberFindFirst: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    teamMember: {
      findMany: mocks.teamMemberFindMany,
      findFirst: mocks.teamMemberFindFirst,
    },
  },
}));

import {
  getPublishedTeamMemberBySlug,
  getPublishedTeamMembers,
} from "@/lib/team/queries";
import { publicTeamMemberSelect } from "@/lib/team/types";

function databaseMember(overrides: Record<string, unknown> = {}) {
  return {
    id: "ada-lovelace",
    name: "Ada Lovelace",
    slug: "ada-lovelace",
    role: "Principal Engineer",
    department: "ENGINEERING",
    bio: "Ada leads the engineering team and maintains the developer platform.",
    about: "Ada builds thoughtful developer experiences.",
    highlights: ["Platform strategy", "Developer advocacy"],
    experience: "Ada has led distributed engineering teams for more than a decade.",
    image: "/images/team/ada.jpg",
    linkedinUrl: "https://www.linkedin.com/in/ada-lovelace",
    facebookUrl: null,
    twitterUrl: null,
    githubUrl: "https://github.com/ada-lovelace",
    displayOrder: 2,
    featured: true,
    ...overrides,
  };
}

describe("getPublishedTeamMembers", () => {
  beforeEach(() => {
    mocks.teamMemberFindMany.mockReset();
    mocks.teamMemberFindFirst.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns serialized published profiles and queries only complete, non-deleted members", async () => {
    const row = databaseMember();
    mocks.teamMemberFindMany.mockResolvedValue([row]);

    await expect(getPublishedTeamMembers()).resolves.toEqual({
      status: "success",
      members: [
        {
          ...row,
          department: "Engineering",
        },
      ],
    });

    expect(mocks.teamMemberFindMany).toHaveBeenCalledWith({
      where: {
        status: "PUBLISHED",
        profileStatus: "COMPLETE",
        deletedAt: null,
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      select: publicTeamMemberSelect,
    });
  });

  it("reports a successful but empty directory when the query has no rows", async () => {
    mocks.teamMemberFindMany.mockResolvedValue([]);

    await expect(getPublishedTeamMembers()).resolves.toEqual({
      status: "success",
      members: [],
    });
  });

  it("reports an unavailable directory and logs when Prisma rejects", async () => {
    const error = new Error("Supabase authentication failed");
    const logError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.teamMemberFindMany.mockRejectedValue(error);

    await expect(getPublishedTeamMembers()).resolves.toEqual({
      status: "unavailable",
      members: [],
    });

    expect(logError).toHaveBeenCalledWith("Failed to fetch published team members:", error);
  });
});

describe("getPublishedTeamMemberBySlug", () => {
  beforeEach(() => {
    mocks.teamMemberFindMany.mockReset();
    mocks.teamMemberFindFirst.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the same public publication gate and returns only the safe serialized profile", async () => {
    const row = databaseMember();
    mocks.teamMemberFindFirst.mockResolvedValue(row);

    await expect(getPublishedTeamMemberBySlug("ada-lovelace")).resolves.toEqual({
      status: "success",
      member: {
        ...row,
        department: "Engineering",
      },
    });

    expect(mocks.teamMemberFindFirst).toHaveBeenCalledWith({
      where: {
        slug: "ada-lovelace",
        status: "PUBLISHED",
        profileStatus: "COMPLETE",
        deletedAt: null,
      },
      select: publicTeamMemberSelect,
    });
    expect(publicTeamMemberSelect).not.toHaveProperty("email");
    expect(publicTeamMemberSelect).not.toHaveProperty("phone");
    expect(publicTeamMemberSelect).not.toHaveProperty("accessRole");
    expect(publicTeamMemberSelect).not.toHaveProperty("adminId");
  });

  it("distinguishes an inaccessible profile from a failed database request", async () => {
    mocks.teamMemberFindFirst.mockResolvedValue(null);

    await expect(getPublishedTeamMemberBySlug("not-public")).resolves.toEqual({
      status: "success",
      member: null,
    });

    const error = new Error("Supabase authentication failed");
    const logError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.teamMemberFindFirst.mockRejectedValue(error);

    await expect(getPublishedTeamMemberBySlug("ada-lovelace")).resolves.toEqual({
      status: "unavailable",
      member: null,
    });

    expect(logError).toHaveBeenCalledWith(
      'Failed to fetch published team member "ada-lovelace":',
      error,
    );
  });
});
