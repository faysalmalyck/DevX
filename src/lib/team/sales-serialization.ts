import {
  serializeTeamMember,
  type TeamMemberRecord,
} from "@/lib/team/types";

/**
 * The Sales portal can edit only the directory fields it owns. Do not return
 * long-form profile content there: its editor round-trips members on update,
 * and omitting these fields guarantees that a Sales edit cannot overwrite
 * Team-admin-authored content.
 */
export type SalesTeamMemberRecord = Omit<
  TeamMemberRecord,
  "about" | "highlights" | "experience"
>;

export function serializeSalesTeamMember(
  member: Parameters<typeof serializeTeamMember>[0],
): SalesTeamMemberRecord {
  const {
    about: _about,
    highlights: _highlights,
    experience: _experience,
    ...salesMember
  } = serializeTeamMember(member);

  return salesMember;
}
