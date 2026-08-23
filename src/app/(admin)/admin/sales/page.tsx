import type { Metadata } from "next";

import SalesDashboard from "@/components/sales/SalesDashboard";

export const metadata: Metadata = {
  title: "Sales Management",
  robots: { index: false, follow: false },
};

/**
 * The parent layout verifies Super Admin / CEO governance access on the
 * server. SalesDashboard keeps using the shared, server-scoped sales API, so
 * this view does not duplicate aggregation or lead authorization logic.
 */
export default function SalesManagementOverviewPage() {
  return <SalesDashboard basePath="/admin/sales" />;
}
