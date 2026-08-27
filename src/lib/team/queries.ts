import { TeamMemberProfileStatus, TeamMemberStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  publicTeamMemberSelect,
  serializePublicTeamMember,
  type PublicTeamMember,
} from "./types";

export async function getPublishedTeamMembers(): Promise<PublicTeamMember[]> {
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

    return members.flatMap((member) => {
      const serialized = serializePublicTeamMember(member);
      return serialized ? [serialized] : [];
    });
  } catch (error) {
    console.error("Failed to fetch published team members:", error);
    return [];
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
