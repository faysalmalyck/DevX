import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HeaderLink from "@/components/layout/Header/Navigation/HeaderLink";
import MobileHeaderLink from "@/components/layout/Header/Navigation/MobileHeaderLink";
import { headerData } from "@/components/layout/Header/Navigation/menuData";

let currentPathname = "/services";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

const servicesItem = headerData.find((item) => item.href === "/services")!;

afterEach(() => {
  currentPathname = "/services";
  window.history.replaceState(null, "", "/");
});

describe("services header links", () => {
  it("renders the three desktop menu choices and marks Business Problems active", () => {
    currentPathname = "/services/business-problems";
    window.history.replaceState(null, "", currentPathname);
    render(<HeaderLink item={servicesItem} />);

    const trigger = screen.getByRole("link", { name: "Services" });
    fireEvent.mouseEnter(trigger.parentElement!);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Services",
      "Services",
      "Business Problems",
      "Pricing",
    ]);
    expect(links.slice(1).map((link) => link.getAttribute("href"))).toEqual([
      "/services",
      "/services/business-problems",
      "/pricing",
    ]);

    expect(
      screen.getByRole("link", { name: "Business Problems" }).getAttribute("aria-current"),
    ).toBe("page");
  });

  it("keeps the mobile Services parent active on a solution detail route", () => {
    currentPathname = "/services/custom-software";
    window.history.replaceState(null, "", currentPathname);
    render(<MobileHeaderLink item={servicesItem} />);

    const disclosure = screen.getByRole("button", { name: "Services" });
    expect(disclosure.getAttribute("aria-current")).toBe("page");

    fireEvent.click(disclosure);
    expect(
      screen
        .getByRole("link", { name: "Services" })
        .getAttribute("aria-current"),
    ).toBeNull();
  });

  it("renders the three mobile menu choices and marks Pricing active", () => {
    currentPathname = "/pricing";
    window.history.replaceState(null, "", currentPathname);
    render(<MobileHeaderLink item={servicesItem} />);

    const disclosure = screen.getByRole("button", { name: "Services" });
    expect(disclosure.getAttribute("aria-expanded")).toBe("false");
    expect(disclosure.getAttribute("aria-current")).toBe("page");
    fireEvent.click(disclosure);

    expect(disclosure.getAttribute("aria-expanded")).toBe("true");
    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Services",
      "Business Problems",
      "Pricing",
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/services",
      "/services/business-problems",
      "/pricing",
    ]);

    expect(
      screen.getByRole("link", { name: "Pricing" }).getAttribute("aria-current"),
    ).toBe("page");
    expect(
      screen
        .getByRole("link", { name: "Business Problems" })
        .getAttribute("aria-current"),
    ).toBeNull();
  });
});
