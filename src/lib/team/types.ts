import type {
  Prisma,
  TeamMemberDepartment,
  TeamMemberProfileStatus,
  SalesTeamRole,
  TeamMemberAccessRole,
} from "@prisma/client";
import { teamMemberDepartmentLabel } from "@/lib/validations/team";

export type TeamMemberRecord = {
  id: string;
  name: string | null;
  slug: string | null;
  role: string | null;
  department: TeamMemberDepartment | null;
  legacyDepartment: string | null;
  bio: string | null;
  image: string | null;
  email: string | null;
  accessRole?: TeamMemberAccessRole | null;
  salesRole?: SalesTeamRole | null;
  adminId?: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  displayOrder: number;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  profileStatus: TeamMemberProfileStatus;
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

type PublicTeamMemberSource = Prisma.TeamMemberGetPayload<{
  select: typeof publicTeamMemberSelect;
}>;

export type PublicTeamMember = Omit<
  PublicTeamMemberSource,
  "name" | "slug" | "role" | "department" | "bio"
> & {
  name: string;
  slug: string;
  role: string;
  department: string;
  bio: string;
};

/**
 * Separates a successfully empty public directory from a failed database
 * request, so callers never present an outage as an empty team.
 */
export type PublicTeamMembersResult =
  | { status: "success"; members: PublicTeamMember[] }
  | { status: "unavailable"; members: [] };

export function serializePublicTeamMember(member: PublicTeamMemberSource): PublicTeamMember | null {
  if (!member.name || !member.slug || !member.role || !member.department || !member.bio) {
    return null;
  }

  const department = teamMemberDepartmentLabel(member.department);
  if (!department) return null;

  return {
    ...member,
    name: member.name,
    slug: member.slug,
    role: member.role,
    department,
    bio: member.bio,
  };
}

export function serializeTeamMember(member: {
  id: string;
  name: string | null;
  slug: string | null;
  role: string | null;
  department: TeamMemberDepartment | null;
  legacyDepartment: string | null;
  bio: string | null;
  image: string | null;
  email: string | null;
  salesRole: SalesTeamRole | null;
  accessRole: TeamMemberAccessRole | null;
  adminId: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  displayOrder: number;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  profileStatus: TeamMemberProfileStatus;
  createdAt: Date;
  updatedAt: Date;
}): TeamMemberRecord {
  return {
    ...member,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  };
}
