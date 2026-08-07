import { TeamMemberStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { publicTeamMemberSelect, type PublicTeamMember } from "./types";

export async function getPublishedTeamMembers(): Promise<PublicTeamMember[]> {
  return prisma.teamMember.findMany({
    where: { status: TeamMemberStatus.PUBLISHED, deletedAt: null },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    select: publicTeamMemberSelect,
  });
}

export async function getPublicTeamMemberState() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return {
    published: members.filter((member) => member.status === TeamMemberStatus.PUBLISHED && member.deletedAt === null),
    managedSlugs: new Set(members.map((member) => member.slug)),
  };
}
