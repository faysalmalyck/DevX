import type { Metadata } from "next";

import SalesLeads from "@/components/sales/SalesLeads";

export const metadata: Metadata = {
  title: "Sales leads",
  robots: { index: false, follow: false },
};

export default function SalesLeadsPage() {
  return <SalesLeads />;
}
