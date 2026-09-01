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

vi.mock("@/components/services/ServicesExperience", () => ({
  default: ({ skin }: { skin?: string }) => (
    <section data-testid="services-experience" data-skin={skin} />
  ),
}));

vi.mock("@/components/home/final-cta/FinalCTA", () => ({
  default: () => <section data-testid="final-cta" />,
}));

describe("ServicesPage composition", () => {
  it("keeps the grid, adds the interactive experience, and ends with FinalCTA", () => {
    const { container } = render(<ServicesPage />);

    expect(
      Array.from(container.children).map((element) =>
        element.getAttribute("data-testid"),
      ),
    ).toEqual([
      "services-hero",
      "development-grid",
      "services-experience",
      "final-cta",
    ]);
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
    expect(
      screen.getByTestId("services-experience").getAttribute("data-skin"),
    ).toBe("cart");
  });
});
