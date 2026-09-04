import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HeaderLink from "@/components/layout/Header/Navigation/HeaderLink";
import MobileHeaderLink from "@/components/layout/Header/Navigation/MobileHeaderLink";
import { headerData } from "@/components/layout/Header/Navigation/menuData";
import { serviceSolutions } from "@/data/service-solutions";

let currentPathname = "/services";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

const servicesItem = headerData.find((item) => item.href === "/services")!;
const aboutItem = headerData.find((item) => item.href === "/about")!;
const serviceHrefs = serviceSolutions.map(({ slug }) => `/services/${slug}`);
const serviceTitles = serviceSolutions.map(({ title }) => title);

afterEach(() => {
  currentPathname = "/services";
  window.history.replaceState(null, "", "/");
});

describe("services header links", () => {
  it("renders a desktop mega-menu with every route-backed service and the active business-problems link", async () => {
    currentPathname = "/services/business-problems";
    window.history.replaceState(null, "", currentPathname);
    render(<HeaderLink item={servicesItem} />);

    const trigger = screen.getByRole("button", { name: "Services" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.mouseEnter(trigger.parentElement!);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const panel = document.querySelector('[aria-label="Services navigation"]');
    for (const token of [
      "rounded-lg",
      "border-slate-200",
      "bg-slate-50",
      "shadow-xl",
      "dark:border-slate-600/80",
      "dark:bg-[linear-gradient(to_bottom,#262d43,#1a2031)]",
      "dark:shadow-2xl",
    ]) {
      expect(panel?.className).toContain(token);
    }
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(["Services", "Business Problems", "Pricing"]);
    expect(
      screen.getAllByRole("link").map((link) => link.textContent?.trim()),
    ).toEqual([
      "View all services",
      ...serviceTitles,
      "Explore business problemsFind a tailored path for automation, modernization, and connected systems.",
      "View pricingExplore packages and find the right fit for your next project.",
      "FAQ",
    ]);
    expect(screen.getByRole("link", { name: "View all services" }).getAttribute("href")).toBe("/services");
    expect(
      serviceTitles.map((title) => screen.getByRole("link", { name: title }).getAttribute("href")),
    ).toEqual(serviceHrefs);
    expect(
      screen.getByRole("link", { name: /Explore business problems/ }).getAttribute("href"),
    ).toBe("/services/business-problems");
    expect(screen.getByRole("link", { name: /View pricing/ }).getAttribute("href")).toBe("/pricing");
    expect(screen.getByRole("link", { name: "FAQ" }).getAttribute("href")).toBe("/pricing#faq");
    expect(
      screen.getByRole("link", { name: /Explore business problems/ }).getAttribute("aria-current"),
    ).toBe("page");

    fireEvent.mouseLeave(trigger.parentElement!);
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("false"));
  });

  it("supports click and keyboard opening, then closes with Escape", () => {
    render(<HeaderLink item={servicesItem} />);

    const trigger = screen.getByRole("button", { name: "Services" });
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.focus(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("keeps the mobile Services parent active on a solution detail route", () => {
    currentPathname = "/services/custom-software";
    window.history.replaceState(null, "", currentPathname);
    render(<MobileHeaderLink item={servicesItem} />);

    const disclosure = screen.getByRole("button", { name: "Services" });
    expect(disclosure.getAttribute("aria-current")).toBe("page");

    fireEvent.click(disclosure);
    expect(screen.getByRole("link", { name: "Custom Software" }).getAttribute("aria-current")).toBe("page");
  });

  it("renders the three mobile mega-menu sections and marks Pricing active", () => {
    currentPathname = "/pricing";
    window.history.replaceState(null, "", currentPathname);
    render(<MobileHeaderLink item={servicesItem} />);

    const disclosure = screen.getByRole("button", { name: "Services" });
    expect(disclosure.getAttribute("aria-expanded")).toBe("false");
    expect(disclosure.getAttribute("aria-current")).toBe("page");
    fireEvent.click(disclosure);

    expect(disclosure.getAttribute("aria-expanded")).toBe("true");
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(["Services", "Business Problems", "Pricing"]);
    expect(
      serviceTitles.map((title) => screen.getByRole("link", { name: title }).getAttribute("href")),
    ).toEqual(serviceHrefs);
    expect(screen.getByRole("link", { name: /View pricing/ }).getAttribute("aria-current")).toBe("page");
    expect(
      screen.getByRole("link", { name: /Explore business problems/ }).getAttribute("aria-current"),
    ).toBeNull();
  });
});

describe("about header links", () => {
  it("renders the route-backed About mega-menu with compact service-style links", () => {
    currentPathname = "/about/our-team";
    window.history.replaceState(null, "", currentPathname);
    render(<HeaderLink item={aboutItem} />);

    const trigger = screen.getByRole("button", { name: "About" });
    fireEvent.mouseEnter(trigger.parentElement!);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.querySelector('[aria-label="About navigation"]')?.parentElement?.className).toContain(
      "w-[min(46rem,calc(100vw-2rem))]",
    );
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(["About", "Explore DevX"]);
    expect(screen.getByRole("link", { name: "View about" }).getAttribute("href")).toBe("/about");
    expect(screen.getByRole("link", { name: /^Our Story/ }).getAttribute("href")).toBe("/about#company-story");
    expect(screen.getByRole("link", { name: /^Company Impact/ }).getAttribute("href")).toBe("/about#company-stats");
    expect(screen.getByRole("link", { name: /^Core Values/ }).getAttribute("href")).toBe("/about/core-value");
    expect(screen.getByRole("link", { name: /^Our Team/ }).getAttribute("href")).toBe("/about/our-team");
    expect(screen.getByRole("link", { name: /^Global Offices/ }).getAttribute("href")).toBe("/about#offices");
    expect(screen.getByRole("link", { name: /^Careers/ }).getAttribute("href")).toBe("/careers");
    expect(screen.getByRole("link", { name: /^Case Studies/ }).getAttribute("href")).toBe("/case-studies");
    expect(screen.getByRole("link", { name: /^Blogs & Articles/ }).getAttribute("href")).toBe("/blog");
    expect(screen.getByRole("link", { name: /^Our Team/ }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: /^About Us/ }).className).toContain("border-transparent");
    expect(screen.getByRole("link", { name: /^About Us/ }).className).toContain("hover:bg-slate-950/[0.05]");
  });

  it("renders the About sections inside the mobile disclosure", () => {
    render(<MobileHeaderLink item={aboutItem} />);

    const disclosure = screen.getByRole("button", { name: "About" });
    fireEvent.click(disclosure);

    expect(disclosure.getAttribute("aria-expanded")).toBe("true");
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(["About", "Explore DevX"]);
    expect(screen.getByRole("link", { name: /^Our Story/ }).getAttribute("href")).toBe("/about#company-story");
    expect(screen.getByRole("link", { name: /^Careers/ }).getAttribute("href")).toBe("/careers");
    expect(screen.getByRole("link", { name: /^Case Studies/ }).getAttribute("href")).toBe("/case-studies");
    expect(screen.getByRole("link", { name: /^Blogs & Articles/ }).getAttribute("href")).toBe("/blog");
  });
});
