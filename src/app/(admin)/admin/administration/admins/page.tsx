import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Administrators", robots: { index: false, follow: false } };
export default function AdminsPage() {
  redirect("/admin/administration/access");
}
