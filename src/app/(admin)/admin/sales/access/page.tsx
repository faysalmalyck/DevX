import type { Metadata } from "next";

import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sales login management",
  robots: { index: false, follow: false },
};

export default function SalesAccessPage() {
  redirect("/admin/administration/access");
}
