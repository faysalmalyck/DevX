import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TeamMemberProfile from "@/components/team/TeamMemberProfile";
import { getPublishedTeamMemberBySlug } from "@/lib/team/queries";
import type { PublicTeamMember } from "@/lib/team/types";

export const dynamic = "force-dynamic";

type TeamMemberProfilePageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

function profileDescription(member: PublicTeamMember) {
  const copy = member.about?.trim() || member.bio;
  const normalized = copy.replace(/\s+/g, " ").trim();

  return normalized.length > 160
    ? `${normalized.slice(0, 157).trimEnd()}…`
    : normalized;
}

export async function generateMetadata({
  params,
}: TeamMemberProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedTeamMemberBySlug(slug);

  if (result.status === "unavailable") {
    return {
      title: "Team Profile | DevX",
      robots: { index: false, follow: false },
    };
  }

  if (!result.member) notFound();

  const { member } = result;
  const title = `${member.name} | ${member.role}`;
  const description = profileDescription(member);
  const url = `/team/${member.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TeamMemberProfilePage({
  params,
}: TeamMemberProfilePageProps) {
  const { slug } = await params;
  const result = await getPublishedTeamMemberBySlug(slug);

  if (result.status === "unavailable") {
    return (
      <main className="min-h-screen bg-white px-4 pb-16 pt-36 text-slate-900 dark:bg-[#181d2b] dark:text-white sm:px-6 sm:pt-44">
        <p role="status" className="mx-auto max-w-2xl text-center text-base leading-7 text-slate-600 dark:text-slate-300">
          This team profile is temporarily unavailable. Please try again shortly.
        </p>
      </main>
    );
  }

  if (!result.member) notFound();

  return <TeamMemberProfile member={result.member} />;
}
