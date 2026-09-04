import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import SolutionDetail from "@/components/services/SolutionDetail";
import {
  getServiceSolutionBySlug,
  serviceSolutions,
} from "@/data/service-solutions";
import { getServiceTechnologyById } from "@/data/service-technologies";
import { businessProblems } from "@/data/services-experience";
import { techStack } from "@/data/techstack";

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
    const sectionHeadings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(sectionHeadings.indexOf("Technology and platform options")).toBeLessThan(
      sectionHeadings.indexOf("Business problems we solve"),
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Business problems we solve" }),
    ).toBeTruthy();
    expect(screen.getAllByTestId("solution-problem-card")).toHaveLength(
      solution.problemSolutions.length,
    );
    for (const problemSolution of solution.problemSolutions) {
      const problem = businessProblems.find(
        (item) => item.id === problemSolution.problemId,
      );
      expect(problem).toBeDefined();
      if (!problem) continue;
      expect(screen.getByRole("heading", { level: 3, name: problem.title })).toBeTruthy();
      expect(screen.getByText(problemSolution.solution)).toBeTruthy();
    }

    for (const capability of solution.capabilities) {
      expect(
        screen.getByRole("heading", { level: 3, name: capability.title }),
      ).toBeTruthy();
    }

    const capabilityCards = screen.getAllByTestId("solution-capability-card");
    expect(capabilityCards).toHaveLength(solution.capabilities.length);

    expect(
      screen.getByRole("heading", { level: 2, name: "Where this service creates value" }),
    ).toBeTruthy();
    const useCaseCards = screen.getAllByTestId("solution-use-case-card");
    expect(useCaseCards).toHaveLength(
      solution.useCases.length,
    );
    for (const useCase of solution.useCases) {
      expect(screen.getByRole("heading", { level: 3, name: useCase.title })).toBeTruthy();
    }

    expect(
      screen.getByRole("heading", { level: 2, name: "Technology and platform options" }),
    ).toBeTruthy();
    const technologyCards = screen.getAllByTestId("solution-technology-card");
    expect(technologyCards).toHaveLength(solution.technologyOptions.length);
    for (const technologyOption of solution.technologyOptions) {
      const technology = getServiceTechnologyById(technologyOption.technologyId);
      expect(technology).toBeDefined();
      if (!technology) continue;
      expect(screen.getAllByText(technology.name).length).toBeGreaterThan(0);
    }
    expect(
      technologyCards.every((card) =>
        Boolean(card.querySelector('[aria-hidden="true"]')),
      ),
    ).toBe(true);
    const reactCard = technologyCards.find((card) => card.textContent?.includes("React"));
    const reactStackIcon = techStack.find((technology) => technology.name === "React");
    expect(reactCard?.querySelector("img")?.getAttribute("src")).toBe(reactStackIcon?.src);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Implementation options shaped around your requirements",
      }),
    ).toBeTruthy();
    const implementationCards = screen.getAllByTestId("solution-implementation-option");
    expect(implementationCards).toHaveLength(
      solution.implementationOptions.length,
    );
    for (const option of solution.implementationOptions) {
      expect(screen.getByRole("heading", { level: 3, name: option.title })).toBeTruthy();
      expect(screen.getByText(option.bestFor)).toBeTruthy();
    }

    const structuredData = document.querySelector('script[type="application/ld+json"]');
    expect(structuredData?.textContent).toContain('"@type":"Service"');
    expect(structuredData?.textContent).toContain(solution.slug);

    for (const outcome of solution.outcomes) {
      expect(
        screen.getByRole("heading", { level: 3, name: outcome.title }),
      ).toBeTruthy();
    }

    const outcomeCards = screen.getAllByTestId("solution-outcome-card");
    expect(outcomeCards).toHaveLength(solution.outcomes.length);
    const problemCards = screen.getAllByTestId("solution-problem-card");
    for (const card of [
      ...capabilityCards,
      ...outcomeCards,
      ...problemCards,
      ...useCaseCards,
      ...technologyCards,
      ...implementationCards,
    ]) {
      for (const token of [
        "rounded-lg",
        "border-slate-200",
        "bg-slate-50",
        "shadow-xl",
        "dark:border-slate-600/80",
        "dark:bg-[linear-gradient(to_bottom,#262d43,#1a2031)]",
        "dark:shadow-2xl",
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
          "bg-slate-50",
          "shadow-xl",
          "dark:border-slate-600/80",
          "dark:bg-[linear-gradient(to_bottom,#262d43,#1a2031)]",
          "dark:shadow-2xl",
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
