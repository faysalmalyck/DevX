import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

// Next.js preserves global state during development hot reloads. When Prisma is
// regenerated after adding a model, that cached client can otherwise predate
// the generated delegate (for example, `teamMember`).
const cachedPrisma = globalForPrisma.prisma;
const hasCurrentTeamMemberDelegate =
  cachedPrisma && typeof cachedPrisma.teamMember !== "undefined";

export const prisma =
  hasCurrentTeamMemberDelegate
    ? cachedPrisma
    :
  new PrismaClient();

if (cachedPrisma && !hasCurrentTeamMemberDelegate) {
  void cachedPrisma.$disconnect();
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
