import { serviceSolutions } from "@/data/service-solutions";
import type { HeaderItem, MegaMenuSection, SubmenuItem } from "@/types/menu";

const serviceMenuItems: readonly SubmenuItem[] = serviceSolutions.map(
  ({ slug, title }) => ({
    label: title,
    href: `/services/${slug}`,
  }),
);

const businessProblemMenuItems: readonly SubmenuItem[] = [
  {
    label: "Explore business problems",
    href: "/services/business-problems",
    description: "Find a tailored path for automation, modernization, and connected systems.",
  },
];

const pricingMenuItems: readonly SubmenuItem[] = [
  {
    label: "View pricing",
    href: "/pricing",
    description: "Explore packages and find the right fit for your next project.",
  },
  {
    label: "FAQ",
    href: "/pricing#faq",
  },
];

const aboutMenuItems: readonly SubmenuItem[] = [
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
];

const aboutExploreMenuItems: readonly SubmenuItem[] = [
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
];

export const servicesMegaMenuSections = [
  {
    id: "services",
    title: "Services",
    href: "/services",
    actionLabel: "View all services",
    items: serviceMenuItems,
    layout: "list",
    columns: 2,
  },
  {
    id: "business-problems",
    title: "Business Problems",
    items: businessProblemMenuItems,
  },
  {
    id: "pricing",
    title: "Pricing",
    items: pricingMenuItems,
    featured: true,
  },
] as const satisfies readonly MegaMenuSection[];

export const aboutMegaMenuSections = [
  {
    id: "about",
    title: "About",
    href: "/about",
    actionLabel: "View about",
    items: aboutMenuItems,
    layout: "list",
    columns: 2,
  },
  {
    id: "explore-devx",
    title: "Explore DevX",
    items: aboutExploreMenuItems,
    layout: "list",
    columns: 1,
  },
] as const satisfies readonly MegaMenuSection[];

export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    megaMenu: { sections: aboutMegaMenuSections, layout: "two-columns" },
  },
  {
    label: "Services",
    href: "/services",
    megaMenu: { sections: servicesMegaMenuSections, layout: "columns" },
  },
  { label: "Clients", href: "/portfolio" },
];
