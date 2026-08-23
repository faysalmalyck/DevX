import type { Metadata } from "next";

import AdminSecurityPage from "@/app/(admin)/admin/security/page";

export const metadata: Metadata = {
  title: "Sales security",
  robots: { index: false, follow: false },
};

/**
 * This is the same self-service security UI used by Administrators. Its
 * backing routes are scoped to the active session's own Admin account.
 */
export default function SalesSecurityPage() {
  return <AdminSecurityPage />;
}
