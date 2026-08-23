import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

// Next.js preserves global state during development hot reloads. When Prisma is
// regenerated after adding a model, that cached client can otherwise predate
// the generated delegates required by the current application.
const cachedPrisma = globalForPrisma.prisma;
const hasCurrentDelegates =
  cachedPrisma &&
  typeof cachedPrisma.teamMember !== "undefined" &&
  typeof cachedPrisma.lead !== "undefined" &&
  typeof cachedPrisma.leadActivity !== "undefined" &&
  typeof cachedPrisma.leadFollowUp !== "undefined" &&
  typeof cachedPrisma.leadCaptureRateLimit !== "undefined";

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
