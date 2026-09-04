export type SubmenuItem = Readonly<{
  label: string;
  href: string;
  description?: string;
}>;

export type MegaMenuSection = Readonly<{
  id: string;
  title: string;
  href?: string;
  actionLabel?: string;
  items: readonly SubmenuItem[];
  featured?: boolean;
  layout?: "list" | "cards";
  columns?: 1 | 2 | 3;
}>;

export type HeaderItem = Readonly<{
  label: string;
  href: string;
  submenu?: readonly SubmenuItem[];
  megaMenu?: Readonly<{
    sections: readonly MegaMenuSection[];
    layout?: "columns" | "two-columns" | "stacked";
  }>;
}>;
