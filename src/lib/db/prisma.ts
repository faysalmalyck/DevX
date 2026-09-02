import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

// Next.js preserves global state during development hot reloads. When Prisma is
// regenerated after adding a model or fields, that cached client can otherwise
// predate the generated delegates and runtime data model used by the app.
const cachedPrisma = globalForPrisma.prisma;
const requiredTeamMemberProfileFields = ["about", "highlights", "experience"];

function hasCurrentTeamMemberProfileFields(client: PrismaClient) {
  const runtimeClient = client as PrismaClient & {
    _runtimeDataModel?: {
      models?: Record<string, { fields?: Array<{ name?: string }> }>;
    };
  };
  const fieldNames = new Set(
    runtimeClient._runtimeDataModel?.models?.TeamMember?.fields
      ?.map((field) => field.name)
      .filter((name): name is string => Boolean(name)),
  );

  return requiredTeamMemberProfileFields.every((field) => fieldNames.has(field));
}

const hasCurrentDelegates =
  cachedPrisma &&
  typeof cachedPrisma.teamMember !== "undefined" &&
  typeof cachedPrisma.lead !== "undefined" &&
  typeof cachedPrisma.leadActivity !== "undefined" &&
  typeof cachedPrisma.leadFollowUp !== "undefined" &&
  typeof cachedPrisma.leadCaptureRateLimit !== "undefined" &&
  hasCurrentTeamMemberProfileFields(cachedPrisma);

export const prisma =
  hasCurrentDelegates
    ? cachedPrisma
    :
  new PrismaClient();

if (cachedPrisma && !hasCurrentDelegates) {
  void cachedPrisma.$disconnect();
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
