import type { Metadata } from "next";

import AdminProfileWorkspace from "@/components/admin/profile/AdminProfileWorkspace";

export const metadata: Metadata = {
  title: "Sales profile",
  robots: { index: false, follow: false },
};

/**
 * The Sales portal has already authorized the current Admin identity in its
 * protected layout. Reuse the existing self-service profile UI, whose API
 * updates only the active session's own Admin record.
 */
export default function SalesProfilePage() {
  return <AdminProfileWorkspace />;
}
