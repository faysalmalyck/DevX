import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import Development from "@/components/home/development/Development";
import { servicesData } from "@/data/services";

type MotionWrapperProps = {
  children: ReactNode;
  className?: string;
};

vi.mock("@/components/motion", () => ({
  HoverCard: ({ children, className }: MotionWrapperProps) => (
    <div className={className}>{children}</div>
  ),
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

vi.mock("next/image", () => ({
  default: ({
    alt,
    fill: _fill,
    priority: _priority,
    sizes: _sizes,
    src,
  }: {
    alt: string;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    src: string;
  }) => <img alt={alt} src={src} />,
}));

describe("Development service cards", () => {
  it("models the requested nine cards in order and retains the four existing descriptions", () => {
    expect(servicesData).toHaveLength(9);
    expect(servicesData.map((service) => service.id)).toEqual([
      "custom-software",
      "website-app-development",
      "mobile-app-development",
      "saas",
      "ai-machine-learning",
      "legacy-modernization",
      "crm-erp",
      "business-automation",
      "databases-data-science",
    ]);

    expect(servicesData.filter((service) => service.status === "draft")).toHaveLength(5);
    expect(servicesData.filter((service) => service.status === "existing")).toHaveLength(4);
    expect(servicesData[1]).toMatchObject({
      title: "Website/App Development",
      description:
        "Building responsive, modern, and scalable web applications tailored to your business needs.",
    });
    expect(servicesData[2]).toMatchObject({
      title: "Mobile App Development",
      description:
        "Seamless & high-performance mobile applications for iOS and Android that keep your users engaged.",
    });
    expect(servicesData[4]).toMatchObject({
      title: "AI & Machine Learning",
      description:
        "Transform data into intelligence with custom AI/ML solutions from predictive analytics to intelligent automation systems.",
      icon: { src: "/images/services/ai.png" },
    });
    expect(servicesData[8]).toMatchObject({
      title: "Databases & Data Science",
      description:
        "Designing secure databases and transforming data into actionable intelligence for business growth.",
    });
    expect(servicesData[1]?.icon).toMatchObject({
      src: "/images/services/website.png",
    });
    expect(servicesData[6]?.icon).toMatchObject({
      src: "/images/services/backend.png",
    });
  });

  it("renders an informational, responsive, equal-height card grid", () => {
    render(<Development />);

    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(servicesData.map((service) => service.title));
    expect(screen.getAllByRole("img")).toHaveLength(9);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Get Pricing" }).getAttribute("href")).toBe(
      "/pricing",
    );

    const grid = document.querySelector(".grid");
    expect(grid?.className).toContain("grid-cols-1");
    expect(grid?.className).toContain("sm:grid-cols-2");
    expect(grid?.className).toContain("lg:grid-cols-3");
    expect(grid?.className).toContain("items-stretch");
    expect(document.querySelectorAll(".h-full.flex.flex-col")).toHaveLength(9);
  });
});
