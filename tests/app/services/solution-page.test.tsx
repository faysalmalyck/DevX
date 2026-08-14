import { isValidElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { notFoundMock } = vi.hoisted(() => ({
  notFoundMock: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

import SolutionPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/(site)/services/[slug]/page";
import {
  serviceSolutions,
  serviceSolutionSlugs,
  type ServiceSolution,
} from "@/data/service-solutions";

describe("service solution route", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
  });

  it("statically generates every configured solution slug", () => {
    expect(generateStaticParams()).toEqual(
      serviceSolutionSlugs.map((slug) => ({ slug })),
    );
  });

  it("generates tailored metadata for every solution", async () => {
    const titles = new Set<string>();

    for (const solution of serviceSolutions) {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: solution.slug }),
      });

      expect(metadata.title).toBe(`${solution.title} Services`);
      expect(metadata.description).toBe(solution.summary);
      expect(metadata.alternates?.canonical).toBe(
        `/services/${solution.slug}`,
      );
      titles.add(String(metadata.title));
    }

    expect(titles.size).toBe(8);
  });

  it("awaits route params and passes the matching record to the template", async () => {
    const result = await SolutionPage({
      params: Promise.resolve({ slug: "system-integration" }),
    });

    expect(isValidElement(result)).toBe(true);
    const props = result.props as { solution: ServiceSolution };
    expect(props.solution.slug).toBe("system-integration");
  });

  it("uses notFound for unknown page and metadata slugs", async () => {
    await expect(
      SolutionPage({
        params: Promise.resolve({ slug: "unknown-solution" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    await expect(
      generateMetadata({
        params: Promise.resolve({ slug: "unknown-solution" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFoundMock).toHaveBeenCalledTimes(2);
  });
});
