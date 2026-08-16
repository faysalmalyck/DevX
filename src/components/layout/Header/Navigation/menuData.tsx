import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    submenu: [
      { label: "About us", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "Core values", href: "/core-values" },
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
        href: "/services#business-problems",
      },
      { label: "Modernization", href: "/services#modernization" },
      { label: "Automation", href: "/services#automation" },
      { label: "Integration", href: "/services#integration" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Clients",
    href: "/portfolio",
    submenu: [{ label: "Portfolio", href: "/portfolio" }],
  },
];
