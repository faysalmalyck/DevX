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

describe("BusinessProblemsPage composition", () => {
  it("uses the cart skin for the business-problems experience", () => {
    const { container } = render(<BusinessProblemsPage />);

    expect(
      Array.from(container.children).map((element) => element.getAttribute("data-testid")),
    ).toEqual(["business-problems-hero", "business-problems-experience"]);
    expect(screen.getByTestId("business-problems-experience").getAttribute("data-skin")).toBe(
      "cart",
    );
  });
});
