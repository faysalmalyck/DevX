import type { Metadata } from "next";

import LeadDetailContent from "@/components/sales/LeadDetailContent";

export const metadata: Metadata = {
  title: "Sales lead",
  robots: { index: false, follow: false },
};

/**
 * The underlying lead page uses the shared server-side lead scope. The parent
 * Sales Management layout adds the stronger Super Admin governance boundary.
 */
export default function SalesManagementLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <LeadDetailContent params={params} basePath="/admin/sales" />;
}
