import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Team Access", robots: { index: false, follow: false } };

export default function TeamAccessPage() {
  redirect("/admin/team?tab=access");
}
