import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import ServicesExperience from "@/components/services/ServicesExperience";
import {
  automationOptions,
  businessProblems,
  integrations,
  modernizationCapabilities,
} from "@/data/services-experience";

type MotionWrapperProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

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

describe("ServicesExperience", () => {
  it("renders every diagnostic item without a duplicate solutions grid", () => {
    render(<ServicesExperience />);

    expect(businessProblems).toHaveLength(8);
    expect(modernizationCapabilities).toHaveLength(8);
    expect(automationOptions).toHaveLength(6);
    expect(integrations).toHaveLength(8);

    expect(screen.getAllByTestId("business-problem-card")).toHaveLength(8);
    expect(screen.getAllByTestId("modernization-card")).toHaveLength(8);
    expect(screen.getAllByTestId("automation-option")).toHaveLength(6);
    expect(screen.getAllByTestId("integration-node")).toHaveLength(8);

    expect(screen.queryByTestId("solution-card")).toBeNull();
    for (const eyebrow of [
      "Start with the friction",
      "Improve what already works",
      "Remove repetitive work",
      "Connect the operating picture",
    ]) {
      expect(screen.queryByText(eyebrow)).toBeNull();
    }
    expect(
      screen.queryByRole("heading", {
        name: "Build the Software Your Business Needs",
      }),
    ).toBeNull();
    expect(
      Array.from(document.querySelectorAll("[data-services-section]")).map(
        (section) => section.id,
      ),
    ).toEqual([
      "business-problems",
      "modernization",
      "automation",
      "integration",
    ]);
    expect(
      screen
        .getByRole("link", { name: "Explore System Integration" })
        .getAttribute("href"),
    ).toBe("/services/system-integration");
  });

  it("uses the established service-card outline on every interactive card family", async () => {
    const user = userEvent.setup();
    render(<ServicesExperience />);

    const outlinedCards = [
      screen.getAllByTestId("business-problem-card")[0],
      screen.getAllByTestId("modernization-card")[0],
      screen.getAllByTestId("automation-option")[1],
      screen.getAllByTestId("integration-node")[0],
    ];

    for (const card of outlinedCards) {
      for (const token of [
        "rounded-lg",
        "border-slate-200",
        "shadow-sm",
        "hover:border-brand/40",
        "hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)]",
        "focus-visible:outline-brand",
        "dark:border-slate-700/80",
        "dark:hover:border-blue-400/50",
      ]) {
        expect(card.className).toContain(token);
      }
    }

    await user.click(outlinedCards[0]);
    expect(outlinedCards[0].className).toContain("border-brand");
    expect(outlinedCards[0].className).toContain("dark:border-blue-400/70");
    expect(outlinedCards[0].className).toContain(
      "dark:shadow-[0_14px_36px_rgba(54,88,255,0.12)]",
    );
    expect(outlinedCards[0].className).not.toContain("dark:shadow-none");
    expect(outlinedCards[0].getAttribute("aria-pressed")).toBe("true");

    const comparison = screen.getByTestId("automation-comparison-card");
    expect(comparison.className).toContain("border-slate-200");
    expect(comparison.className).toContain("shadow-sm");
    expect(comparison.className).toContain("dark:border-slate-700/80");

    const manualCard = screen.getByTestId("manual-process-card");
    expect(manualCard.className).toContain("rounded-lg");
    expect(manualCard.className).toContain("border-amber-200");
    expect(manualCard.className).toContain("shadow-sm");

    const automatedCard = screen.getByTestId("automated-process-card");
    expect(automatedCard.className).toContain("rounded-lg");
    expect(automatedCard.className).toContain("border-brand/25");
    expect(automatedCard.className).toContain("shadow-sm");
  });

  it("carries selected business problems into the process form", async () => {
    const user = userEvent.setup();
    render(<ServicesExperience />);

    const problemCards = screen.getAllByTestId("business-problem-card");

    await user.click(problemCards[0]);
    await user.click(problemCards[2]);

    expect(problemCards[0].getAttribute("aria-pressed")).toBe("true");
    expect(problemCards[2].getAttribute("aria-pressed")).toBe("true");

    await user.click(
      screen.getByRole("button", { name: "Let’s Fix Your Process" }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Let’s Fix Your Process",
    });
    const topics = within(dialog).getByLabelText("Selected topics");
    expect(topics.textContent).toContain("Manual Processes");
    expect(topics.textContent).toContain("Disconnected Systems");
  });

  it("carries modernization selections into its contextual form", async () => {
    const user = userEvent.setup();
    render(<ServicesExperience />);

    const capabilities = screen.getAllByTestId("modernization-card");
    await user.click(capabilities[1]);
    await user.click(capabilities[5]);

    await user.click(
      screen.getByRole("button", { name: "Improve My Software" }),
    );

    const dialog = screen.getByRole("dialog", { name: "Improve My Software" });
    const topics = within(dialog).getByLabelText("Selected topics");
    expect(topics.textContent).toContain("API Integration");
    expect(topics.textContent).toContain("Cloud Migration");
  });

  it("updates the workflow comparison and supports arrow-key tab selection", async () => {
    const user = userEvent.setup();
    render(<ServicesExperience />);

    const workflowTab = screen.getByRole("tab", { name: "Workflow Automation" });
    expect(workflowTab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByTestId("manual-process").textContent).toContain(
      "checks every request",
    );

    workflowTab.focus();
    await user.keyboard("{ArrowRight}");

    const crmTab = screen.getByRole("tab", { name: "CRM Automation" });
    expect(crmTab.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(crmTab);

    await user.click(screen.getByRole("tab", { name: "Reporting Automation" }));
    expect(screen.getByTestId("manual-process").textContent).toContain(
      "export files",
    );
    expect(screen.getByTestId("automated-process").textContent).toContain(
      "consistent report",
    );

    await user.click(
      screen.getByRole("button", { name: "Automate My Business" }),
    );
    expect(
      within(
        screen.getByRole("dialog", { name: "Automate My Business" }),
      ).getByLabelText("Selected topics").textContent,
    ).toContain("Reporting Automation");
  });

  it("selects integration nodes and includes them in the integration enquiry", async () => {
    const user = userEvent.setup();
    render(<ServicesExperience />);

    const integrationNodes = screen.getAllByTestId("integration-node");
    const crm = integrationNodes[0];
    const payments = integrationNodes[4];
    await user.click(crm);
    await user.click(payments);

    expect(crm.getAttribute("aria-pressed")).toBe("true");
    expect(payments.getAttribute("aria-pressed")).toBe("true");

    await user.click(
      screen.getByRole("button", { name: "Discuss an Integration" }),
    );
    const topics = within(
      screen.getByRole("dialog", { name: "Discuss an Integration" }),
    ).getByLabelText("Selected topics");
    expect(topics.textContent).toContain("CRM");
    expect(topics.textContent).toContain("Payment Systems");
  });

  it.each([
    "business-problems",
    "modernization",
    "automation",
    "integration",
  ])("restores the #%s cold deep link after the interactive sections mount", async (sectionId) => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
    window.history.replaceState({}, "", `/services#${sectionId}`);

    render(<ServicesExperience />);

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());
    expect(scrollIntoView).toHaveBeenCalledWith({
      block: "start",
      behavior: "auto",
    });

    window.history.replaceState({}, "", "/");
    delete (HTMLElement.prototype as { scrollIntoView?: unknown }).scrollIntoView;
  });
});
