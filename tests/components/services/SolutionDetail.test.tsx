import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import SolutionDetail from "@/components/services/SolutionDetail";
import {
  getServiceSolutionBySlug,
  serviceSolutions,
} from "@/data/service-solutions";

vi.mock("@/components/motion", () => ({
  HoverCard: ({ children }: { children: ReactNode }) => <>{children}</>,
  ScrollReveal: ({ children }: { children: ReactNode }) => <>{children}</>,
  StaggerContainer: ({ children }: { children: ReactNode }) => <>{children}</>,
  StaggerItem: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/home/final-cta/LeadCaptureDialog", () => ({
  default: ({
    request,
  }: {
    request: { intent: string; topics?: readonly string[] } | null;
  }) =>
    request ? (
      <div role="dialog" aria-label="Project enquiry">
        <span>{request.intent}</span>
        {request.topics?.map((topic) => <span key={topic}>{topic}</span>)}
      </div>
    ) : null,
}));

describe("SolutionDetail", () => {
  it("renders the rich solution sections and three related links", () => {
    const solution = getServiceSolutionBySlug("custom-software");
    expect(solution).toBeDefined();
    if (!solution) return;

    render(<SolutionDetail solution={solution} />);

    const articleShell = screen.getByTestId("solution-article-shell");
    expect(articleShell.className).toContain("bg-slate-50");
    expect(articleShell.className).toContain("dark:bg-darkmode");

    const heroHeading = screen.getByRole("heading", {
      level: 1,
      name: "Custom Software",
    });
    for (const token of ["text-center", "text-3xl", "sm:text-5xl", "lg:text-6xl"]) {
      expect(heroHeading.className).toContain(token);
    }
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);

    const backLink = screen.getByRole("link", {
      name: "Back to all services",
    });
    expect(backLink.getAttribute("href")).toBe("/services");
    expect(backLink.className).toContain("hover:-translate-x-1");

    const heroVisual = screen.getByTestId("solution-hero-visual");
    expect(heroVisual.className).toContain("w-full");
    expect(heroVisual.className).toContain("rounded-lg");
    for (const eyebrow of [
      "Built around your business",
      "The business challenge",
      "What we can build",
      "Business outcomes",
      "How we deliver",
    ]) {
      expect(screen.queryByText(eyebrow)).toBeNull();
    }
    expect(screen.getByText(solution.challenge.title)).toBeTruthy();

    for (const capability of solution.capabilities) {
      expect(
        screen.getByRole("heading", { level: 3, name: capability.title }),
      ).toBeTruthy();
    }

    const capabilityCards = screen.getAllByTestId("solution-capability-card");
    expect(capabilityCards).toHaveLength(solution.capabilities.length);

    for (const outcome of solution.outcomes) {
      expect(
        screen.getByRole("heading", { level: 3, name: outcome.title }),
      ).toBeTruthy();
    }

    const outcomeCards = screen.getAllByTestId("solution-outcome-card");
    expect(outcomeCards).toHaveLength(solution.outcomes.length);
    for (const card of [...capabilityCards, ...outcomeCards]) {
      for (const token of [
        "rounded-xl",
        "border-slate-200",
        "shadow-sm",
        "hover:border-brand/40",
        "hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)]",
        "dark:border-slate-700/80",
        "dark:hover:border-blue-400/50",
      ]) {
        expect(card.className).toContain(token);
      }
    }

    for (const step of solution.delivery) {
      expect(
        screen.getByRole("heading", { level: 3, name: step.title }),
      ).toBeTruthy();
    }

    const relatedLinks = screen.getAllByTestId("related-service-card");
    expect(relatedLinks).toHaveLength(3);
    expect(relatedLinks.map((link) => link.getAttribute("href"))).toEqual(
      solution.related.map((slug) => `/services/${slug}`),
    );
    expect(
      relatedLinks.map(
        (link) => within(link).getByRole("img").getAttribute("alt"),
      ),
    ).toEqual([
      "Frontend Development - Dev X Webflow Template",
      "Connected cloud, database, application, and server systems",
      "Business Automation illustration",
    ]);
    expect(
      relatedLinks.every((link) =>
        [
          "rounded-lg",
          "border-slate-200",
          "shadow-sm",
          "dark:border-slate-700/80",
        ].every((token) => link.className.includes(token)),
      ),
    ).toBe(true);
    expect(
      screen
        .getByRole("link", { name: /view all services/i })
        .getAttribute("href"),
    ).toBe("/services");
    expect(document.querySelector('a[href="/services#solutions"]')).toBeNull();
  });

  it("uses the supplied System Integration image in the article-style hero", () => {
    const solution = getServiceSolutionBySlug("system-integration");
    expect(solution).toBeDefined();
    if (!solution) return;

    render(<SolutionDetail solution={solution} />);

    const heroVisual = screen.getByTestId("solution-hero-visual");
    const heroImage = within(heroVisual).getByRole("img");
    expect(decodeURIComponent(heroImage.getAttribute("src") ?? "")).toContain(
      "/images/services/systemintegration.png",
    );
    expect(heroImage.getAttribute("alt")).toBe(
      "Connected cloud, database, application, and server systems",
    );
    expect(heroVisual.className).toContain("aspect-[3/2]");
  });

  it("opens a project enquiry with the current solution as its topic", async () => {
    const user = userEvent.setup();
    const solution = getServiceSolutionBySlug("ai-solutions");
    expect(solution).toBeDefined();
    if (!solution) return;

    render(<SolutionDetail solution={solution} />);

    await user.click(
      screen.getByRole("button", { name: "Discuss this project" }),
    );

    expect(
      screen.getByRole("dialog", { name: "Project enquiry" }),
    ).toBeTruthy();
    expect(screen.getByText("project")).toBeTruthy();
    expect(screen.getAllByText("AI Solutions").length).toBeGreaterThan(0);
  });

  it.each(serviceSolutions)(
    "reuses three service cards for $slug related solutions",
    (solution) => {
      render(<SolutionDetail solution={solution} />);

      const relatedCards = screen.getAllByTestId("related-service-card");
      expect(relatedCards).toHaveLength(3);
      expect(relatedCards.map((card) => card.getAttribute("href"))).toEqual(
        solution.related.map((slug) => `/services/${slug}`),
      );
    },
  );
});
