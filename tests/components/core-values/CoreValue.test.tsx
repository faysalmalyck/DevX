import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import CoreValues from "@/components/core-values/CoreValue";

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
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

describe("CoreValues", () => {
  it("renders its values as unframed grid items", () => {
    render(<CoreValues />);

    const valueHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(valueHeadings).toHaveLength(6);
    expect(valueHeadings.map((heading) => heading.textContent)).toEqual([
      "Best quality",
      "Top tier infrastructure",
      "Innovation & Technology",
      "Always iterate",
      "User centered",
      "Escalation in mind",
    ]);

    valueHeadings.forEach((heading) => {
      const value = heading.parentElement;
      expect(value?.className).toContain("flex");
      expect(value?.className).not.toContain("rounded");
      expect(value?.className).not.toContain("border");
      expect(value?.className).not.toContain("bg-");
      expect(value?.className).not.toContain("p-");
    });
  });
});
