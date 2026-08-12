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
    <div className={className}>{children}</div>
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
  });

  it("renders an accessible, responsive equal-height carousel", () => {
    render(<WhyDevX />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Why Growing Businesses Choose DevX.",
      }),
    ).toBeTruthy();
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(whyDevxData.map((card) => card.title));
    expect(screen.getAllByRole("img")).toHaveLength(6);

    whyDevxData.forEach((card) => {
      expect(screen.getByAltText(card.image.alt).getAttribute("src")).toBe(card.image.src);
      expect(screen.getAllByText(card.description)).toHaveLength(3);
    });

    const carousel = screen.getByTestId("why-devx-carousel");
    expect(carousel.className).toContain("overflow-x-auto");
    expect(carousel.querySelectorAll("[data-card]")).toHaveLength(18);
    expect(carousel.querySelectorAll("[data-card][aria-hidden='true']")).toHaveLength(12);
    expect(screen.getByRole("button", { name: "Previous reason" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next reason" })).toBeTruthy();
    expect(document.querySelectorAll("article.h-full.flex.flex-col")).toHaveLength(18);
    expect(document.querySelectorAll("article > .h-px")).toHaveLength(0);
  });
});
