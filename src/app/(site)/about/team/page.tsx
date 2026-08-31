import TeamSection from "@/components/team/TeamPage";
import { getPublishedTeamMembers } from "@/lib/team/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Team | DevX Solutions",
  description: "Meet the team behind DevX Solutions",
};

export default async function TeamPage() {
  const team = await getPublishedTeamMembers();

  return <TeamSection team={team} />;
}
