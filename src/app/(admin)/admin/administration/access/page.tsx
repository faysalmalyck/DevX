import type { Metadata } from "next";

import TeamAccessManagement from "@/components/admin/TeamAccessManagement";

export const metadata: Metadata = { title: "Team Access", robots: { index: false, follow: false } };

export default function TeamAccessPage() {
  return <TeamAccessManagement />;
}
