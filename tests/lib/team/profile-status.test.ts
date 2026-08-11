import { describe, expect, it } from "vitest";
import {
  deriveTeamMemberProfileStatus,
  type TeamMemberProfileStatus,
} from "@/lib/team/profile-status";
import type { TeamMemberProfileValues } from "@/lib/validations/team";

const completeProfile = {
  name: "Ada Lovelace",
  slug: "ada-lovelace",
  role: "Principal Engineer",
  department: "ENGINEERING",
  bio: "Ada leads the engineering team and maintains the developer platform.",
  email: "ada@example.com",
} satisfies TeamMemberProfileValues;

function profile(overrides: Record<string, unknown> = {}): TeamMemberProfileValues {
  return { ...completeProfile, ...overrides } as TeamMemberProfileValues;
}

const cases: Array<{
  name: string;
  profile: TeamMemberProfileValues;
  expected: TeamMemberProfileStatus;
}> = [
  {
    name: "a profile with every required field and a valid email",
    profile: profile(),
    expected: "COMPLETE",
  },
  {
    name: "a profile with no email, because email is optional",
    profile: profile({ email: null }),
    expected: "COMPLETE",
  },
  {
    name: "a missing name",
    profile: profile({ name: "  " }),
    expected: "INCOMPLETE",
  },
  {
    name: "a missing slug",
    profile: profile({ slug: null }),
    expected: "INCOMPLETE",
  },
  {
    name: "a missing role",
    profile: profile({ role: "" }),
    expected: "INCOMPLETE",
  },
  {
    name: "a missing department",
    profile: profile({ department: null }),
    expected: "INCOMPLETE",
  },
  {
    name: "a missing biography",
    profile: profile({ bio: " " }),
    expected: "INCOMPLETE",
  },
  {
    name: "an empty record",
    profile: {
      name: null,
      slug: null,
      role: null,
      department: null,
      bio: null,
      email: null,
    } as TeamMemberProfileValues,
    expected: "INCOMPLETE",
  },
  {
    name: "an invalid email address",
    profile: profile({ email: "not-an-email" }),
    expected: "INCOMPLETE",
  },
  {
    name: "an unsupported department value",
    profile: profile({ department: "UNSUPPORTED" }),
    expected: "INCOMPLETE",
  },
];

describe("deriveTeamMemberProfileStatus", () => {
  it.each(cases)("returns $expected for $name", ({ profile: candidate, expected }) => {
    expect(deriveTeamMemberProfileStatus(candidate)).toBe(expected);
  });
});
