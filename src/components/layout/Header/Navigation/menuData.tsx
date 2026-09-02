import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    submenu: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Case studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    submenu: [
      { label: "Services", href: "/services" },
      {
        label: "Business Problems",
        href: "/services/business-problems",
      },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Clients",
    href: "/portfolio",
    submenu: [{ label: "Portfolio", href: "/portfolio" }],
  },
];
