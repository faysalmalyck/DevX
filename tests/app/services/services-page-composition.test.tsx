import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ServicesPage from "@/app/(site)/services/page";

vi.mock("@/components/shared/HeroSub", () => ({
  default: () => <section data-testid="services-hero" />,
}));

vi.mock("@/components/home/development/Development", () => ({
  default: ({
    showCornerFlares,
    showHeading,
    showImprovementCta,
  }: {
    showCornerFlares?: boolean;
    showHeading?: boolean;
    showImprovementCta?: boolean;
  }) => (
    <section
      data-testid="development-grid"
      data-show-corner-flares={String(showCornerFlares)}
      data-show-heading={String(showHeading)}
      data-show-improvement-cta={String(showImprovementCta)}
    />
  ),
}));

vi.mock("@/components/services/SolutionLeadCTA", () => ({
  default: ({ solutionTitle }: { solutionTitle: string }) => (
    <section data-testid="solution-lead-cta" data-solution-title={solutionTitle} />
  ),
}));

describe("ServicesPage composition", () => {
  it("keeps only the nine-card service grid and ends with a Solution Lead CTA", () => {
    const { container } = render(<ServicesPage />);

    expect(
      Array.from(container.children).map((element) =>
        element.getAttribute("data-testid"),
      ),
    ).toEqual([
      "services-hero",
      "development-grid",
      "solution-lead-cta",
    ]);
    expect(screen.queryByTestId("services-experience")).toBeNull();
    expect(screen.queryByTestId("final-cta")).toBeNull();
    expect(screen.getByTestId("solution-lead-cta").getAttribute("data-solution-title")).toBe(
      "Digital Solution",
    );
    expect(
      screen
        .getByTestId("development-grid")
        .getAttribute("data-show-improvement-cta"),
    ).toBe("false");
    expect(screen.getByTestId("development-grid").getAttribute("data-show-heading")).toBe(
      "false",
    );
    expect(
      screen.getByTestId("development-grid").getAttribute("data-show-corner-flares"),
    ).toBe("false");
  });
});
