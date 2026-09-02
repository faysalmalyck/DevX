import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import TeamSection from "@/components/team/TeamPage";
import type { PublicTeamMember, PublicTeamMembersResult } from "@/lib/team/types";

type MotionWrapperProps = {
  children: ReactNode;
  className?: string;
};

vi.mock("@/components/motion", () => ({
  HoverCard: ({ children, className }: MotionWrapperProps) => <div className={className}>{children}</div>,
  ScrollReveal: ({ children, className }: MotionWrapperProps) => <div className={className}>{children}</div>,
  StaggerContainer: ({ children, className }: MotionWrapperProps) => <div className={className}>{children}</div>,
  StaggerItem: ({ children, className }: MotionWrapperProps) => <div className={className}>{children}</div>,
}));

function member(overrides: Partial<PublicTeamMember> = {}): PublicTeamMember {
  return {
    id: "ada-lovelace",
    name: "Ada Lovelace",
    slug: "ada-lovelace",
    role: "Principal Engineer",
    department: "Engineering",
    bio: "Ada leads the engineering team and maintains the developer platform.",
    about: null,
    highlights: [],
    experience: null,
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

describe("TeamSection", () => {
  it("renders profile cards for a successful directory response", () => {
    const team = {
      status: "success",
      members: [member()],
    } satisfies PublicTeamMembersResult;

    render(<TeamSection team={team} />);

    expect(screen.getByRole("heading", { level: 2, name: "Ada Lovelace" })).toBeTruthy();
    expect(screen.getByText("Principal Engineer")).toBeTruthy();
    expect(screen.getByText("Engineering")).toBeTruthy();
    expect(screen.getByText(/Ada leads the engineering team/)).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "View Ada Lovelace's profile" }).getAttribute("href"),
    ).toBe("/team/ada-lovelace");
    expect(screen.queryByText("Our team profiles will be available soon.")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
    const glow = document.getElementById("teamDiagonalGlowGradient")?.closest("svg");
    expect(glow?.getAttribute("aria-hidden")).toBe("true");
    expect(glow?.className.baseVal).toContain("pointer-events-none");
    expect(glow?.className.baseVal).toContain("sm:block");
    expect(glow?.querySelector("path")?.getAttribute("class")).toContain(
      "animate-[pulse_6s_ease-in-out_infinite]",
    );
  });

  it("keeps the existing empty-directory message for a successful empty response", () => {
    const team = {
      status: "success",
      members: [],
    } satisfies PublicTeamMembersResult;

    render(<TeamSection team={team} />);

    expect(screen.getByText("Our team profiles will be available soon.")).toBeTruthy();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("shows a distinct temporary-unavailability message when the directory cannot load", () => {
    const team = {
      status: "unavailable",
      members: [],
    } satisfies PublicTeamMembersResult;

    render(<TeamSection team={team} />);

    expect(screen.getByRole("status").textContent).toMatch(/temporarily unavailable/i);
    expect(screen.queryByText("Our team profiles will be available soon.")).toBeNull();
  });
});
