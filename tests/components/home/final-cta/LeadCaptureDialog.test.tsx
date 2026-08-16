import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LeadCaptureDialog, {
  buildLeadMailto,
  type LeadRequest,
} from "@/components/home/final-cta/LeadCaptureDialog";

describe("LeadCaptureDialog", () => {
  it.each<
    [NonNullable<LeadRequest>["intent"], string, string]
  >([
    ["consultation", "Book a Free Consultation", "Prepare consultation email"],
    ["project", "Tell Us About Your Project", "Prepare project email"],
    ["process", "Turn Your Business Challenges Into Better Processes", "Prepare process email"],
    ["software-improvement", "Improve My Software", "Prepare improvement email"],
    ["automation", "Automate My Business", "Prepare automation email"],
    ["integration", "Discuss an Integration", "Prepare integration email"],
  ])("uses contextual copy for the %s request", (intent, title, submitLabel) => {
    render(
      <LeadCaptureDialog
        request={{ intent }}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog", { name: title })).toBeTruthy();
    expect(screen.getByRole("button", { name: submitLabel })).toBeTruthy();
    expect(screen.queryByText("Let's get started")).toBeNull();
  });

  it("shows selected topics as read-only chips", () => {
    render(
      <LeadCaptureDialog
        request={{
          intent: "integration",
          topics: ["CRM", "Payment Systems"],
        }}
        onClose={vi.fn()}
      />,
    );

    const selectedTopics = screen.getByLabelText("Selected topics");

    expect(selectedTopics.textContent).toContain("CRM");
    expect(selectedTopics.textContent).toContain("Payment Systems");
    expect(selectedTopics.querySelectorAll("button")).toHaveLength(0);
  });

  it("includes the request intent and selected topics in the generated email", () => {
    const mailto = decodeURIComponent(
      buildLeadMailto(
        {
          intent: "automation",
          topics: ["Workflow Automation", "Reporting Automation"],
        },
        {
          name: "Alex Morgan",
          email: "alex@example.com",
          phone: "",
          company: "Northstar",
          message: "We want routine handoffs to happen automatically.",
        },
      ),
    );

    expect(mailto).toContain("subject=Business automation request — Alex Morgan");
    expect(mailto).toContain("Selected topics:\n- Workflow Automation\n- Reporting Automation");
    expect(mailto).toContain("What would you like to automate?");
  });
});
