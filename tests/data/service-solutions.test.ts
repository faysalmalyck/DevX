import { describe, expect, it } from "vitest";
import {
  getServiceSolutionBySlug,
  serviceSolutions,
  serviceSolutionSlugs,
} from "@/data/service-solutions";

describe("service solutions data", () => {
  it("defines exactly the ten ordered solution routes", () => {
    expect(serviceSolutionSlugs).toEqual([
      "custom-software",
      "web-applications",
      "mobile-applications",
      "crm-erp",
      "business-automation",
      "ai-solutions",
      "system-integration",
      "legacy-modernization",
      "saas",
      "databases-data-science",
    ]);
    expect(serviceSolutions).toHaveLength(10);
    expect(serviceSolutions.map(({ slug }) => slug)).toEqual(
      serviceSolutionSlugs,
    );
    expect(new Set(serviceSolutionSlugs).size).toBe(10);
  });

  it("provides complete rich-page content and valid related links", () => {
    for (const solution of serviceSolutions) {
      expect(solution).not.toHaveProperty("eyebrow");
      expect(solution.title).toBeTruthy();
      expect(solution.summary).toBeTruthy();
      expect(solution.heroStatement).toBeTruthy();
      expect(solution.challenge.title).toBeTruthy();
      expect(solution.challenge.description).toBeTruthy();
      expect(solution.capabilities).toHaveLength(4);
      expect(solution.outcomes).toHaveLength(3);
      expect(solution.delivery).toHaveLength(3);
      expect(solution.related).toHaveLength(3);
      expect(solution.related).not.toContain(solution.slug);
      expect(new Set(solution.related).size).toBe(3);

      for (const relatedSlug of solution.related) {
        expect(getServiceSolutionBySlug(relatedSlug)).toBeDefined();
      }
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getServiceSolutionBySlug("not-a-service")).toBeUndefined();
  });

  it("defines hero images for all service solutions", () => {
    for (const solution of serviceSolutions) {
      expect(solution.heroImage?.src).toBeTruthy();
      expect(solution.heroImage?.alt).toBeTruthy();
    }
  });
});

