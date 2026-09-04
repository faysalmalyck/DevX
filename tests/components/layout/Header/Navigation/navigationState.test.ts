import { describe, expect, it } from "vitest";
import { headerData } from "@/components/layout/Header/Navigation/menuData";
import { serviceSolutions } from "@/data/service-solutions";
import {
  getNavigationItems,
  isNavigationHrefActive,
  isNavigationParentActive,
} from "@/components/layout/Header/Navigation/navigationState";

describe("about navigation menu", () => {
  const aboutItem = headerData.find((item) => item.href === "/about");

  it("centralizes the distinct About routes and existing on-page anchors", () => {
    expect(aboutItem?.megaMenu?.layout).toBe("two-columns");
    expect(aboutItem?.megaMenu?.sections.map(({ title }) => title)).toEqual([
      "About",
      "Explore DevX",
    ]);
    expect(getNavigationItems(aboutItem!)).toEqual([
      {
        label: "About Us",
        href: "/about",
      },
      {
        label: "Our Story",
        href: "/about#company-story",
      },
      {
        label: "Company Impact",
        href: "/about#company-stats",
      },
      {
        label: "Core Values",
        href: "/about/core-value",
      },
      {
        label: "Our Team",
        href: "/about/our-team",
      },
      {
        label: "Global Offices",
        href: "/about#offices",
      },
      {
        label: "Careers",
        href: "/careers",
      },
      {
        label: "Case Studies",
        href: "/case-studies",
      },
      {
        label: "Blogs & Articles",
        href: "/blog",
      },
    ]);
    expect(getNavigationItems(aboutItem!)).not.toContainEqual({ label: "Our Team", href: "/about/team" });
    expect(getNavigationItems(aboutItem!)).not.toContainEqual({ label: "Case Studies", href: "/about/case-study" });
  });

  it("keeps About active for each page represented in its mega-menu", () => {
    expect(isNavigationParentActive(aboutItem!, "/about/core-value")).toBe(true);
    expect(isNavigationParentActive(aboutItem!, "/careers")).toBe(true);
    expect(isNavigationParentActive(aboutItem!, "/case-studies")).toBe(true);
    expect(isNavigationParentActive(aboutItem!, "/blog")).toBe(true);
    expect(isNavigationParentActive(aboutItem!, "/portfolio")).toBe(false);
  });
});

describe("services navigation state", () => {
  const servicesItem = headerData.find((item) => item.href === "/services");

  it("centralizes all route-backed services, business problems, and pricing in three sections", () => {
    expect(servicesItem?.megaMenu?.sections.map(({ title }) => title)).toEqual([
      "Services",
      "Business Problems",
      "Pricing",
    ]);
    expect(servicesItem?.megaMenu?.sections[0]?.items).toEqual(
      serviceSolutions.map(({ slug, title }) => ({
        label: title,
        href: `/services/${slug}`,
      })),
    );
    expect(getNavigationItems(servicesItem!)).toEqual([
      ...serviceSolutions.map(({ slug, title }) => ({
        label: title,
        href: `/services/${slug}`,
      })),
      {
        label: "Explore business problems",
        href: "/services/business-problems",
        description: "Find a tailored path for automation, modernization, and connected systems.",
      },
      {
        label: "View pricing",
        href: "/pricing",
        description: "Explore packages and find the right fit for your next project.",
      },
      {
        label: "FAQ",
        href: "/pricing#faq",
      },
    ]);
  });

  it("matches each direct Services menu route", () => {
    expect(isNavigationHrefActive("/services", "/services", "")).toBe(true);
    expect(
      isNavigationHrefActive(
        "/services/business-problems",
        "/services/business-problems",
        "",
      ),
    ).toBe(true);
    expect(isNavigationHrefActive("/pricing", "/pricing", "")).toBe(true);
    expect(
      isNavigationHrefActive("/services", "/services/business-problems", ""),
    ).toBe(false);
    expect(isNavigationHrefActive("/pricing", "/services", "")).toBe(false);
  });

  it("keeps the Services parent active on solution detail routes and Pricing", () => {
    expect(servicesItem).toBeDefined();
    expect(
      isNavigationParentActive(
        servicesItem!,
        "/services/custom-software",
      ),
    ).toBe(true);
    expect(isNavigationParentActive(servicesItem!, "/pricing")).toBe(true);
    expect(isNavigationParentActive(servicesItem!, "/portfolio")).toBe(false);
  });
});
