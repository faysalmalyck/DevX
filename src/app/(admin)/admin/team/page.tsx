import type { Metadata } from "next";
import TeamAdmin from "@/components/Team/TeamAdmin";

export const metadata: Metadata = { title: "Team management", robots: { index: false, follow: false } };

export default function TeamAdminPage() {
  return <TeamAdmin />;
}
