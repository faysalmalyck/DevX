import type { Metadata } from "next";

import AdminProfilePage from "@/app/(admin)/admin/profile/page";

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
  return <AdminProfilePage />;
}
