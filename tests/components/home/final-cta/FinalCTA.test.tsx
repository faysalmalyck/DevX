import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import FinalCTA from "@/components/home/final-cta/FinalCTA";

vi.mock("@/components/motion", () => ({
  ScrollReveal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("FinalCTA", () => {
  it("opens a consultation form from the consultation action", async () => {
    const user = userEvent.setup();
    render(<FinalCTA />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Have a Business Problem Technology Can Solve?",
      }),
    ).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /book a free consultation/i }));

    expect(
      screen.getByRole("dialog", { name: "Book a Free Consultation" }),
    ).toBeTruthy();
    expect(screen.getByLabelText(/^name/i)).toBeTruthy();
    expect(screen.getByLabelText(/^email/i)).toBeTruthy();
    expect(screen.getByLabelText(/what would you like to solve/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Prepare consultation email" })).toBeTruthy();
  });

  it("opens a project-specific form from the project action", async () => {
    const user = userEvent.setup();
    render(<FinalCTA />);

    await user.click(screen.getByRole("button", { name: /tell us about your project/i }));

    expect(
      screen.getByRole("dialog", { name: "Tell Us About Your Project" }),
    ).toBeTruthy();
    expect(screen.getByLabelText(/project details/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Prepare project email" })).toBeTruthy();
    expect(
      screen.getByText("This opens your default email app. Nothing is sent until you choose Send there."),
    ).toBeTruthy();
  });

  it("closes the form with its close control", async () => {
    const user = userEvent.setup();
    render(<FinalCTA />);

    await user.click(screen.getByRole("button", { name: /book a free consultation/i }));
    await user.click(screen.getByRole("button", { name: "Close enquiry form" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("validates required form fields before preparing an email", async () => {
    const user = userEvent.setup();
    render(<FinalCTA />);

    await user.click(screen.getByRole("button", { name: /tell us about your project/i }));
    await user.click(screen.getByRole("button", { name: "Prepare project email" }));

    expect(screen.getByText("Enter your name (2–120 characters).")).toBeTruthy();
    expect(screen.getByText("Enter a valid email address.")).toBeTruthy();
    expect(
      screen.getByText("Please enter a message between 10 and 5,000 characters."),
    ).toBeTruthy();
  });
});
