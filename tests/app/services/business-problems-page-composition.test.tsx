import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BusinessProblemsPage from "@/app/(site)/services/business-problems/page";

vi.mock("@/components/shared/HeroSub", () => ({
  default: () => <section data-testid="business-problems-hero" />,
}));

vi.mock("@/components/services/ServicesExperience", () => ({
  default: ({ skin }: { skin?: string }) => (
    <section data-testid="business-problems-experience" data-skin={skin} />
  ),
}));

vi.mock("@/components/home/final-cta/FinalCTA", () => ({
  default: () => <section data-testid="final-cta" />,
}));

describe("BusinessProblemsPage composition", () => {
  it("uses the cart skin for the experience and ends with FinalCTA", () => {
    const { container } = render(<BusinessProblemsPage />);

    expect(
      Array.from(container.children).map((element) => element.getAttribute("data-testid")),
    ).toEqual([
      "business-problems-hero",
      "business-problems-experience",
      "final-cta",
    ]);
    expect(screen.getByTestId("business-problems-experience").getAttribute("data-skin")).toBe(
      "cart",
    );
    expect(screen.getByTestId("final-cta")).toBeTruthy();
  });
});
