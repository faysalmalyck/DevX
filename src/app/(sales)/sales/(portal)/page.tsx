import type { Metadata } from "next";

import SalesDashboard from "@/components/sales/SalesDashboard";

export const metadata: Metadata = {
  title: "Sales overview",
  robots: { index: false, follow: false },
};

export default function SalesPage() {
  return <SalesDashboard />;
}
