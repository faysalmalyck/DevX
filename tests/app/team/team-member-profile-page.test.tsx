import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PublicTeamMember } from "@/lib/team/types";

const mocks = vi.hoisted(() => ({
  getPublishedTeamMemberBySlug: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: mocks.notFound,
}));

vi.mock("@/lib/team/queries", () => ({
  getPublishedTeamMemberBySlug: mocks.getPublishedTeamMemberBySlug,
}));

vi.mock("@/components/team/TeamMemberProfile", () => ({
  default: ({ member }: { member: PublicTeamMember }) => (
    <div data-testid="team-member-profile">{member.name}</div>
  ),
}));

import TeamMemberProfilePage, {
  generateMetadata,
} from "@/app/(site)/team/[slug]/page";

function member(overrides: Partial<PublicTeamMember> = {}): PublicTeamMember {
  return {
    id: "ada-lovelace",
    name: "Ada Lovelace",
    slug: "ada-lovelace",
    role: "Principal Engineer",
    department: "Engineering",
    bio: "Ada leads the engineering team and maintains the developer platform.",
    about: "Ada builds thoughtful developer experiences.",
    aboutParagraph2: null,
    highlights: ["Platform strategy"],
    experience: "Ada has led engineering teams for more than a decade.",
    image: "/images/team/ada.jpg",
    linkedinUrl: null,
    facebookUrl: null,
    twitterUrl: null,
    githubUrl: null,
    displayOrder: 2,
    featured: true,
    ...overrides,
  };
}

describe("team member profile route", () => {
  beforeEach(() => {
    mocks.getPublishedTeamMemberBySlug.mockReset();
    mocks.notFound.mockClear();
  });

  it("uses the public member profile to compose canonical metadata and render the profile", async () => {
    const profile = member();
    mocks.getPublishedTeamMemberBySlug.mockResolvedValue({
      status: "success",
      member: profile,
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: profile.slug }),
    });
    const page = await TeamMemberProfilePage({
      params: Promise.resolve({ slug: profile.slug }),
    });
    render(page);

    expect(metadata).toMatchObject({
      title: "Ada Lovelace | Principal Engineer",
      description: "Ada builds thoughtful developer experiences.",
      alternates: { canonical: "/team/ada-lovelace" },
      openGraph: {
        url: "/team/ada-lovelace",
        type: "profile",
      },
    });
    expect(screen.getByTestId("team-member-profile").textContent).toBe("Ada Lovelace");
    expect(mocks.getPublishedTeamMemberBySlug).toHaveBeenCalledWith("ada-lovelace");
  });

  it("returns a not-found response for a slug without an eligible published profile", async () => {
    mocks.getPublishedTeamMemberBySlug.mockResolvedValue({
      status: "success",
      member: null,
    });

    await expect(
      generateMetadata({ params: Promise.resolve({ slug: "not-public" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(
      TeamMemberProfilePage({ params: Promise.resolve({ slug: "not-public" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mocks.notFound).toHaveBeenCalledTimes(2);
  });

  it("keeps a database outage distinct from a missing profile", async () => {
    mocks.getPublishedTeamMemberBySlug.mockResolvedValue({
      status: "unavailable",
      member: null,
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "ada-lovelace" }),
    });
    render(
      await TeamMemberProfilePage({
        params: Promise.resolve({ slug: "ada-lovelace" }),
      }),
    );

    expect(metadata).toMatchObject({
      title: "Team Profile | DevX",
      robots: { index: false, follow: false },
    });
    expect(screen.getByRole("status").textContent).toMatch(/temporarily unavailable/i);
    expect(mocks.notFound).not.toHaveBeenCalled();
  });
});
