import type { Metadata } from "next";

import SalesFollowUps from "@/components/sales/SalesFollowUps";

export const metadata: Metadata = {
  title: "Sales follow-ups",
  robots: { index: false, follow: false },
};

export default function SalesManagementFollowUpsPage() {
  return <SalesFollowUps detailBasePath="/admin/sales" />;
}
