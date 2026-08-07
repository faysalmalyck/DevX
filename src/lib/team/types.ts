import type { Prisma } from "@prisma/client";

export type TeamMemberRecord = {
  id: string;
  name: string;
  slug: string;
  role: string;
  department: string;
  bio: string;
  image: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  displayOrder: number;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  updatedAt: string;
};

/**
 * The only TeamMember fields that may cross from a server page into the
 * public client component. Contact details and publication internals stay on
 * the server/admin surface.
 */
export const publicTeamMemberSelect = {
  id: true,
  name: true,
  slug: true,
  role: true,
  department: true,
  bio: true,
  image: true,
  linkedinUrl: true,
  facebookUrl: true,
  twitterUrl: true,
  githubUrl: true,
  displayOrder: true,
  featured: true,
} satisfies Prisma.TeamMemberSelect;

export type PublicTeamMember = Prisma.TeamMemberGetPayload<{
  select: typeof publicTeamMemberSelect;
}>;

export function serializeTeamMember(member: {
  id: string; name: string; slug: string; role: string; department: string; bio: string;
  image: string | null; email: string | null; phone: string | null; linkedinUrl: string | null;
  facebookUrl: string | null; twitterUrl: string | null; githubUrl: string | null;
  displayOrder: number; featured: boolean; status: "DRAFT" | "PUBLISHED";
  createdAt: Date; updatedAt: Date;
}): TeamMemberRecord {
  return { ...member, createdAt: member.createdAt.toISOString(), updatedAt: member.updatedAt.toISOString() };
}
