import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    submenu: [
      { label: "About us", href: "/about" },
      { label: "Team", href: "/about/team" },
      { label: "Careers", href: "/careers" },
      { label: "Core Values", href: "/about/core-value" },
      { label: "Case Studies", href: "/about/case-study" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    submenu: [
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
    ]
  },
  {
    label: "Clients",
    href: "/portfolio",
    submenu: [{ label: "Portfolio", href: "/portfolio" }],
  },
];
