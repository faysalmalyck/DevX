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

    const contactAction = screen.getByRole("link", { name: "Contact us" });
    const servicesAction = screen.getByRole("link", { name: "Our services" });
    expect(contactAction.className).toContain("max-w-[280px]");
    expect(servicesAction.className).toContain("max-w-[280px]");
    expect(contactAction.className).toContain("sm:w-40");
    expect(servicesAction.className).toContain("sm:w-44");

    const section = screen
      .getByRole("heading", { level: 2 })
      .closest("section");
    const flare = section?.querySelector("[data-ambient-flare]");
    expect(section?.className).toContain("isolate");
    expect(section?.className).toContain("overflow-hidden");
    expect(section?.querySelectorAll("[data-ambient-flare]")).toHaveLength(1);
    expect(flare?.getAttribute("data-variant")).toBe("banner");
    expect(flare?.className).not.toContain("hidden");
    expect(flare?.parentElement?.querySelector(".z-10")).toBeTruthy();

    const decorativeSvg = document.querySelector("svg[aria-hidden='true']");
    expect(decorativeSvg?.querySelectorAll("path")).toHaveLength(2);
  });
});
