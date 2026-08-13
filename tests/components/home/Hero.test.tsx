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
  it("clips one broad flare behind the visual and content", () => {
    render(<HeroSection />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: /We Build the Technology Behind Growing Businesses/i,
    });
    const section = heading.closest("section");
    const flare = section?.querySelector("[data-ambient-flare]");

    expect(section?.className).toContain("isolate");
    expect(section?.className).toContain("overflow-hidden");
    expect(section?.querySelectorAll("[data-ambient-flare]")).toHaveLength(1);
    expect(flare?.getAttribute("data-variant")).toBe("hero");
    expect(flare?.className).toContain("lg:-right-[6%]");
    expect(heading.closest(".z-10")).toBeTruthy();
  });
});
