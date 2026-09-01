import { describe, expect, it } from "vitest";
import { headerData } from "@/components/layout/Header/Navigation/menuData";
import {
  isNavigationHrefActive,
  isNavigationParentActive,
} from "@/components/layout/Header/Navigation/navigationState";

describe("services navigation state", () => {
  const servicesItem = headerData.find((item) => item.href === "/services");

  it("exposes the overview, dedicated business-problems page, section anchors, and pricing in order", () => {
    expect(servicesItem?.submenu).toEqual([
      { label: "Services", href: "/services" },
      {
        label: "Business Problems",
        href: "/services/business-problems",
      },
      { label: "Modernization", href: "/services#modernization" },
      { label: "Automation", href: "/services#automation" },
      { label: "Integration", href: "/services#integration" },
      { label: "Pricing", href: "/pricing" },
    ]);
  });

  it("matches only the current hash target on the services overview", () => {
    const sectionHrefs = servicesItem?.submenu
      ?.map((item) => item.href)
      .filter((href) => href.includes("#"));

    expect(
      sectionHrefs?.filter((href) =>
        isNavigationHrefActive(href, "/services", "#automation"),
      ),
    ).toEqual(["/services#automation"]);
    expect(
      isNavigationHrefActive("/services", "/services", "#automation"),
    ).toBe(false);
    expect(
      isNavigationHrefActive(
        "/services/business-problems",
        "/services/business-problems",
        "",
      ),
    ).toBe(true);
  });

  it("keeps the Services parent active on solution detail routes", () => {
    expect(servicesItem).toBeDefined();
    expect(
      isNavigationParentActive(
        servicesItem!,
        "/services/custom-software",
      ),
    ).toBe(true);
    expect(isNavigationParentActive(servicesItem!, "/portfolio")).toBe(false);
  });
});
