import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import WhyDevX from "@/components/home/why-devx/WhyDevX";
import { whyDevxData } from "@/data/whydevx";

type MotionWrapperProps = {
  children: ReactNode;
  className?: string;
};

vi.mock("@/components/motion", () => ({
  HoverCard: ({ children, className }: MotionWrapperProps) => (
    <div className={className}>{children}</div>
  ),
  ScrollReveal: ({ children, className }: MotionWrapperProps) => (
    <div className={className}>{children}</div>
  ),
  StaggerContainer: ({ children, className }: MotionWrapperProps) => (
    <div data-testid="why-devx-motion-container" className={className}>
      {children}
    </div>
  ),
  StaggerItem: ({ children, className }: MotionWrapperProps) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    fill: _fill,
    sizes: _sizes,
    src,
  }: {
    alt: string;
    fill?: boolean;
    sizes?: string;
    src: string;
  }) => <img alt={alt} src={src} />,
}));

describe("WHY DEVX cards", () => {
  it("models the six requested benefits with supporting copy", () => {
    expect(whyDevxData).toHaveLength(6);
    expect(whyDevxData.map((card) => card.title)).toEqual([
      "Business First",
      "Scalable Architecture",
      "Modern Technology",
      "Transparent Process",
      "Long-Term Partnership",
      "Cost Efficient",
    ]);
    expect(whyDevxData.every((card) => card.description.length > 0)).toBe(true);
    expect(
      whyDevxData.every(
        (card) => card.description.trim().split(/\s+/).length === 16,
      ),
    ).toBe(true);
  });

  it("renders an accessible, responsive equal-height carousel", () => {
    render(<WhyDevX />);

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Why Growing Businesses Choose DevX.",
    });
    expect(heading).toBeTruthy();
    expect(heading.className).toContain("text-4xl");
    expect(heading.className).toContain("md:text-5xl");
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(whyDevxData.map((card) => card.title));
    expect(screen.getAllByRole("img")).toHaveLength(6);

    whyDevxData.forEach((card) => {
      expect(screen.getByAltText(card.image.alt).getAttribute("src")).toBe(card.image.src);
      expect(screen.getAllByText(card.description)).toHaveLength(3);
    });

    const carousel = screen.getByTestId("why-devx-carousel");
    const motionContainer = screen.getByTestId("why-devx-motion-container");
    expect(motionContainer.className).toContain("w-full");
    expect(motionContainer.className).toContain("items-stretch");
    expect(motionContainer.className).toContain("overflow-x-auto");
    const cards = Array.from(carousel.querySelectorAll("[data-card]"));
    expect(cards).toHaveLength(18);
    expect(carousel.querySelectorAll("[data-card][aria-hidden='true']")).toHaveLength(12);
    cards.forEach((carouselCard) => {
      expect(carouselCard.parentElement?.classList.contains("self-stretch")).toBe(true);
      expect(carouselCard.classList.contains("h-full")).toBe(true);
      expect(carouselCard.classList.contains("w-full")).toBe(true);
    });
    const card = cards[0];
    const cardItemClassName = card?.parentElement?.className ?? "";
    expect(cardItemClassName).toContain("sm:w-[48vw]");
    expect(cardItemClassName).toContain("md:w-[40vw]");
    expect(cardItemClassName).toContain("lg:w-[31vw]");
    expect(cardItemClassName).toContain("self-stretch");
    expect(card?.className).toContain("h-full");
    expect(card?.className).toContain("w-full");
    expect(screen.getByRole("button", { name: "Previous reason" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next reason" })).toBeTruthy();
    expect(document.querySelectorAll("article.h-full.flex.flex-col")).toHaveLength(18);
    expect(document.querySelectorAll("article > .h-px")).toHaveLength(0);
  });
});
