import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  teamMemberFindMany: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    teamMember: {
      findMany: mocks.teamMemberFindMany,
    },
  },
}));

import { getPublishedTeamMembers } from "@/lib/team/queries";
import { publicTeamMemberSelect } from "@/lib/team/types";

function databaseMember(overrides: Record<string, unknown> = {}) {
  return {
    id: "ada-lovelace",
    name: "Ada Lovelace",
    slug: "ada-lovelace",
    role: "Principal Engineer",
    department: "ENGINEERING",
    bio: "Ada leads the engineering team and maintains the developer platform.",
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
