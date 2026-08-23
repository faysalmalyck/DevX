import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import LeadCaptureDialog, { type LeadRequest } from "@/components/home/final-cta/LeadCaptureDialog";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("LeadCaptureDialog", () => {
  it.each<
    [NonNullable<LeadRequest>["intent"], string, string]
  >([
    ["consultation", "Book a Free Consultation", "Request consultation"],
    ["project", "Tell Us About Your Project", "Send project enquiry"],
    ["process", "Turn Your Business Challenges Into Better Processes", "Send process enquiry"],
    ["software-improvement", "Improve My Software", "Send improvement enquiry"],
    ["automation", "Automate My Business", "Send automation enquiry"],
    ["integration", "Discuss an Integration", "Send integration enquiry"],
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

  it("submits the request and selected topics to the lead capture endpoint", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ leadId: "lead-1" }) });
    vi.stubGlobal("fetch", fetchMock);
    const onClose = vi.fn();
    render(<LeadCaptureDialog request={{ intent: "automation", topics: ["Workflow Automation", "Reporting Automation"] }} onClose={onClose} />);

    await user.type(screen.getByLabelText(/^name/i), "Alex Morgan");
    await user.type(screen.getByLabelText(/^email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/what would you like to automate/i), "We want routine handoffs to happen automatically.");
    await user.click(screen.getByRole("button", { name: "Send automation enquiry" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith("/api/leads/capture", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Alex Morgan",
        email: "alex@example.com",
        phone: undefined,
        company: undefined,
        message: "We want routine handoffs to happen automatically.\n\nSelected topics:\n- Workflow Automation\n- Reporting Automation",
        formType: "CONTACT",
      }),
    }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
