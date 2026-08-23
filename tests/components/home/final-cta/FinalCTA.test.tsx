import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import FinalCTA from "@/components/home/final-cta/FinalCTA";

vi.mock("@/components/motion", () => ({
  ScrollReveal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("FinalCTA", () => {
  it("opens a process form and links to the services diagnostic", async () => {
    const user = userEvent.setup();
    render(<FinalCTA />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Your Business Problem Deserves a/i,
      }),
    ).toBeTruthy();
    expect(screen.queryByText("Start with the problem")).toBeNull();
    expect(
      screen
        .getByRole("link", { name: /explore business solutions/i })
        .getAttribute("href"),
    ).toBe("/services/business-problems");
    const ctaCard = screen.getByTestId("final-cta-card");
    for (const token of [
      "rounded-lg",
      "border-slate-200",
      "shadow-sm",
      "hover:border-brand/40",
      "hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)]",
      "dark:border-slate-700/80",
      "dark:hover:border-blue-400/50",
    ]) {
      expect(ctaCard.className).toContain(token);
    }

    await user.click(screen.getByRole("button", { name: /discuss your business challenge/i }));

    expect(
      screen.getByRole("dialog", { name: "Turn Your Business Challenges Into Better Processes" }),
    ).toBeTruthy();
    expect(screen.getByLabelText(/^name/i)).toBeTruthy();
    expect(screen.getByLabelText(/^email/i)).toBeTruthy();
    expect(screen.getByLabelText(/what should work better/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Send process enquiry" })).toBeTruthy();
    expect(
      screen.getByText("Your details are sent securely to our team. We’ll be in touch soon."),
    ).toBeTruthy();
  });

  it("closes the form with its close control", async () => {
    const user = userEvent.setup();
    render(<FinalCTA />);

    await user.click(screen.getByRole("button", { name: /discuss your business challenge/i }));
    await user.click(screen.getByRole("button", { name: "Close enquiry form" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("validates required form fields before submitting an enquiry", async () => {
    const user = userEvent.setup();
    render(<FinalCTA />);

    await user.click(screen.getByRole("button", { name: /discuss your business challenge/i }));
    await user.click(screen.getByRole("button", { name: "Send process enquiry" }));

    expect(screen.getByText("Enter your name (2–120 characters).")).toBeTruthy();
    expect(screen.getByText("Enter a valid email address.")).toBeTruthy();
    expect(
      screen.getByText("Please enter a message between 10 and 5,000 characters."),
    ).toBeTruthy();
  });
});
