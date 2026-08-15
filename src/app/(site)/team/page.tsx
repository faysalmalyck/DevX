import type { Metadata } from "next";
import TeamSection from "@/components/team/TeamPage";
import { getPublishedTeamMembers } from "@/lib/team/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team | DevX Solutions",
  description: "Meet the team behind DevX Solutions",
};

export default async function TeamPage() {
  const members = await getPublishedTeamMembers();

  return <TeamSection members={members} />;
}

