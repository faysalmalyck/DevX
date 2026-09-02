import { TeamMemberProfileStatus, TeamMemberStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  publicTeamMemberSelect,
  serializePublicTeamMember,
  type PublicTeamMemberResult,
  type PublicTeamMembersResult,
} from "./types";

export async function getPublishedTeamMembers(): Promise<PublicTeamMembersResult> {
  try {
    const members = await prisma.teamMember.findMany({
      where: {
        status: TeamMemberStatus.PUBLISHED,
        profileStatus: TeamMemberProfileStatus.COMPLETE,
        deletedAt: null,
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      select: publicTeamMemberSelect,
    });

    const publishedMembers = members.flatMap((member) => {
      const serialized = serializePublicTeamMember(member);
      return serialized ? [serialized] : [];
    });

    return { status: "success", members: publishedMembers };
  } catch (error) {
    console.error("Failed to fetch published team members:", error);
    return { status: "unavailable", members: [] };
  }
}

/**
 * Loads one profile for the public site. The publication predicate lives in
 * the database query so a draft, incomplete, or soft-deleted record cannot
 * be revealed by guessing its slug.
 */
export async function getPublishedTeamMemberBySlug(
  slug: string,
): Promise<PublicTeamMemberResult> {
  try {
    const member = await prisma.teamMember.findFirst({
      where: {
        slug,
        status: TeamMemberStatus.PUBLISHED,
        profileStatus: TeamMemberProfileStatus.COMPLETE,
        deletedAt: null,
      },
      select: publicTeamMemberSelect,
    });

    return {
      status: "success",
      member: member ? serializePublicTeamMember(member) : null,
    };
  } catch (error) {
    console.error(`Failed to fetch published team member "${slug}":`, error);
    return { status: "unavailable", member: null };
  }
}

export async function getPublicTeamMemberState() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return {
      published: members.filter((member) => (
        member.status === TeamMemberStatus.PUBLISHED
        && member.profileStatus === TeamMemberProfileStatus.COMPLETE
        && member.deletedAt === null
      )),
      managedSlugs: new Set(members.flatMap((member) => member.slug ? [member.slug] : [])),
    };
  } catch (error) {
    console.error("Failed to fetch team member state:", error);
    return {
      published: [],
      managedSlugs: new Set<string>(),
    };
  }
}
