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

  it("renders an accessible, responsive equal-height card grid", () => {
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
      expect(screen.getByText(card.description)).toBeTruthy();
    });

    const grid = document.querySelector(".grid");
    expect(grid?.className).toContain("grid-cols-1");
    expect(grid?.className).toContain("sm:grid-cols-2");
    expect(grid?.className).toContain("lg:grid-cols-3");
    expect(grid?.className).toContain("items-stretch");
    expect(document.querySelectorAll("article.h-full.flex.flex-col")).toHaveLength(6);
    expect(document.querySelectorAll("article > .aspect-square")).toHaveLength(6);
    expect(document.querySelectorAll("article > .h-px")).toHaveLength(0);
  });
});
