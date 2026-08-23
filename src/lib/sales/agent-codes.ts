import { randomBytes } from "node:crypto";

const CODE_SUFFIX_BYTES = 4;
const MAX_GENERATION_ATTEMPTS = 8;

function slugSegment(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36);
}

export function agentCodePrefix(firstName: string, lastName: string): string {
  const prefix = [slugSegment(firstName), slugSegment(lastName)]
    .filter(Boolean)
    .join("-");

  return prefix || "agent";
}

export function createAgentCodeCandidate(firstName: string, lastName: string): string {
  const suffix = randomBytes(CODE_SUFFIX_BYTES).toString("hex");
  return `${agentCodePrefix(firstName, lastName)}-${suffix}`;
}

/**
 * Generate a readable immutable referral code. The caller supplies the lookup
 * so this helper works with both PrismaClient and a Prisma transaction client.
 */
export async function generateUniqueAgentCode(
  firstName: string,
  lastName: string,
  isTaken: (code: string) => Promise<boolean>
): Promise<string> {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const code = createAgentCodeCandidate(firstName, lastName);
    if (!(await isTaken(code))) return code;
  }

  throw new Error("Unable to generate a unique sales agent code.");
}
