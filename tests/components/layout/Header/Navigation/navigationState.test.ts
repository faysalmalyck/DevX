import { describe, expect, it } from "vitest";
import { headerData } from "@/components/layout/Header/Navigation/menuData";
import {
  isNavigationHrefActive,
  isNavigationParentActive,
} from "@/components/layout/Header/Navigation/navigationState";

describe("about navigation menu", () => {
  const aboutItem = headerData.find((item) => item.href === "/about");

  it("keeps only About us, Careers, Case studies, and Blog in order", () => {
    expect(aboutItem?.submenu).toEqual([
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Case studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
    ]);
    expect(aboutItem?.submenu).not.toContainEqual({ label: "Team", href: "/team" });
    expect(aboutItem?.submenu).not.toContainEqual({
      label: "Core values",
      href: "/core-values",
    });
  });
});

describe("services navigation state", () => {
  const servicesItem = headerData.find((item) => item.href === "/services");

  it("exposes Services, Business Problems, and Pricing in order", () => {
    expect(servicesItem?.submenu).toEqual([
      { label: "Services", href: "/services" },
      {
        label: "Business Problems",
        href: "/services/business-problems",
      },
      { label: "Pricing", href: "/pricing" },
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
