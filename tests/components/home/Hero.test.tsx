import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import HeroSection from "@/components/home/Hero";

type MotionWrapperProps = {
  children: ReactNode;
  className?: string;
};

vi.mock("@/components/motion", () => ({
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
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

describe("Homepage hero", () => {
  it("keeps the visual free of an external glow and widens the heading", () => {
    render(<HeroSection />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: /We Build the Technology Behind Growing Businesses/i,
    });
    const section = heading.closest("section");

    expect(section?.className).toContain("isolate");
    expect(section?.className).toContain("overflow-hidden");
    expect(section?.querySelectorAll("[data-ambient-flare]")).toHaveLength(0);
    expect(heading.parentElement?.parentElement?.className).toContain(
      "max-w-[650px]",
    );
    expect(heading.closest(".z-10")).toBeTruthy();
  });
});
