import {
  teamMemberProfileSchema,
  type TeamMemberProfileValues,
} from "@/lib/validations/team";

export type TeamMemberProfileStatus = "COMPLETE" | "INCOMPLETE";

export function getTeamMemberProfileFieldErrors(
  profile: TeamMemberProfileValues,
): Record<string, string[]> {
  const parsed = teamMemberProfileSchema.safeParse(profile);
  if (parsed.success) return {};

  return parsed.error.issues.reduce<Record<string, string[]>>((errors, issue) => {
    const field = String(issue.path[0] ?? "form");
    errors[field] = [...(errors[field] ?? []), issue.message];
    return errors;
  }, {});
}

/**
 * The server persists this value on every TeamMember create/update. Keeping
 * the calculation here also lets the form show the same validation guidance
 * without making the browser the source of truth.
 */
export function deriveTeamMemberProfileStatus(
  profile: TeamMemberProfileValues,
): TeamMemberProfileStatus {
  return Object.keys(getTeamMemberProfileFieldErrors(profile)).length === 0
    ? "COMPLETE"
    : "INCOMPLETE";
}
