import type { Metadata } from "next";
import PublishedTeamPage from "@/components/team/PublishedTeamPage";
import { getPublishedTeamMembers } from "@/lib/team/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the focused Vertex team building modern digital products for growing businesses.",
};

export default async function TeamPage() {
  const members = await getPublishedTeamMembers();

  return <PublishedTeamPage members={members} />;
}
