import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import ReadyToContact from "@/components/home/ready-to-contact/Ready";

vi.mock("@/components/motion", () => ({
  ScrollReveal: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

describe("Ready to contact CTA", () => {
  it("renders the reference-style heading, actions, and decorative linework", () => {
    render(<ReadyToContact />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Ready to start working\s+together with our team\?/i,
      }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Contact us" }).getAttribute("href")).toBe(
      "/contact",
    );
    expect(screen.getByRole("link", { name: "Our services" }).getAttribute("href")).toBe(
      "/services",
    );

    const decorativeSvg = document.querySelector("svg[aria-hidden='true']");
    expect(decorativeSvg?.querySelectorAll("path")).toHaveLength(2);
  });
});
