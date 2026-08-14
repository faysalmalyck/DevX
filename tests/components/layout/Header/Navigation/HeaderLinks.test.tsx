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
  it("marks only the current desktop section link active", () => {
    window.history.replaceState(null, "", "/services#automation");
    render(<HeaderLink item={servicesItem} />);

    fireEvent.mouseEnter(screen.getByRole("link", { name: /Services/i }).parentElement!);

    expect(
      screen.getByRole("link", { name: "Automation" }).getAttribute("aria-current"),
    ).toBe("location");
    expect(
      screen.getByRole("link", { name: "Modernization" }).getAttribute("aria-current"),
    ).toBeNull();
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

  it("uses the current hash for an expanded mobile submenu", () => {
    window.history.replaceState(null, "", "/services#integration");
    render(<MobileHeaderLink item={servicesItem} />);

    fireEvent.click(screen.getByRole("button", { name: "Services" }));

    expect(
      screen
        .getByRole("link", { name: "Integration" })
        .getAttribute("aria-current"),
    ).toBe("location");
    expect(
      screen.getByRole("link", { name: "Automation" }).getAttribute("aria-current"),
    ).toBeNull();
  });
});
