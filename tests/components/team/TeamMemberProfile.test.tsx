import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TeamMemberProfile from "@/components/team/TeamMemberProfile";
import type { PublicTeamMember } from "@/lib/team/types";

function member(overrides: Partial<PublicTeamMember> = {}): PublicTeamMember {
  return {
    id: "ada-lovelace",
    name: "Ada Lovelace",
    slug: "ada-lovelace",
    role: "Principal Engineer",
    department: "Engineering",
    bio: "Ada leads the engineering team and maintains the developer platform.",
    about: "Ada builds thoughtful developer experiences.\nShe partners closely with product teams.",
    aboutParagraph2: null,
    highlights: ["Platform strategy", "Developer advocacy"],
    experience: "Ada has led distributed engineering teams for more than a decade.",
    image: "/images/team/ada.jpg",
    linkedinUrl: "https://www.linkedin.com/in/ada-lovelace",
    facebookUrl: "javascript:alert('unsafe')",
    twitterUrl: "https://x.com/ada",
    githubUrl: "https://github.com/ada-lovelace",
    displayOrder: 2,
    featured: true,
    ...overrides,
  };
}

describe("TeamMemberProfile", () => {
  it("renders the editable public profile sections and only safe social links", () => {
    render(<TeamMemberProfile member={member()} />);

    const backToTeam = screen.getByRole("link", { name: "Back to team" });
    expect(backToTeam.getAttribute("href")).toBe("/team");
    expect(backToTeam.className).not.toContain("rounded");
    expect(backToTeam.className).not.toContain("border");
    expect(backToTeam.className).not.toContain("bg-");
    expect(backToTeam.className).toContain("hover:-translate-x-1");
    expect(backToTeam.className).toContain("text-slate-700");
    expect(screen.getByRole("heading", { level: 1, name: "Ada Lovelace" })).toBeTruthy();
    expect(screen.getByText("Principal Engineer")).toBeTruthy();
    expect(screen.getByText("Engineering")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "About Ada Lovelace" })).toBeTruthy();
    expect(screen.getByText(/Ada builds thoughtful developer experiences/)).toBeTruthy();
    expect(screen.getByText("Platform strategy")).toBeTruthy();
    expect(screen.getByText("Developer advocacy")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Ada Lovelace’s Experience" })).toBeTruthy();
    expect(screen.getByText(/distributed engineering teams/)).toBeTruthy();
    const profileCard = screen.getByTestId("team-member-profile-card");
    expect(profileCard.className).toContain("border-[#414b62]");
    expect(profileCard.className).toContain("bg-[linear-gradient(180deg,#222a40_0%,#131927_100%)]");

    expect(screen.getByLabelText("Ada Lovelace's LinkedIn").getAttribute("href")).toBe(
      "https://www.linkedin.com/in/ada-lovelace",
    );
    expect(screen.getByLabelText("Ada Lovelace's X").getAttribute("href")).toBe("https://x.com/ada");
    expect(screen.getByLabelText("Ada Lovelace's GitHub").getAttribute("href")).toBe(
      "https://github.com/ada-lovelace",
    );
    expect(screen.queryByLabelText("Ada Lovelace's Facebook")).toBeNull();
  });

  it("renders the second about paragraph directly below the first paragraph when content exists", () => {
    const profile = member({
      about: "First about paragraph.",
      aboutParagraph2: "Second about paragraph.",
    });

    render(<TeamMemberProfile member={profile} />);

    expect(screen.getByText("First about paragraph.")).toBeTruthy();
    expect(screen.getByText("Second about paragraph.")).toBeTruthy();
  });

  it("falls back to the directory biography and hides empty optional sections", () => {
    const profile = member({ about: null, aboutParagraph2: null, highlights: [], experience: null });

    render(<TeamMemberProfile member={profile} />);

    expect(screen.getByText(profile.bio)).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "Highlights" })).toBeNull();
    expect(screen.queryByRole("heading", { level: 3, name: "Ada Lovelace’s Experience" })).toBeNull();
  });
});
