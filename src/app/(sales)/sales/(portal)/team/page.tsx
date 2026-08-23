import type { Metadata } from "next";
import SalesTeamManagement from "@/components/sales/SalesTeamManagement";

export const metadata: Metadata = { title: "Sales Team", robots: { index: false, follow: false } };

export default function SalesTeamPage() {
  return <SalesTeamManagement />;
}
