import "server-only";

import { prisma } from "@/lib/db/prisma";
import { deleteCareerResume } from "./career-resumes";

const CLEANUP_BATCH_SIZE = 25;
const IMMEDIATE_DELETE_ATTEMPTS = 2;

function nextCleanupAttempt(attempts: number): Date {
  const delayMinutes = Math.min(60 * 24, 2 ** Math.min(attempts, 10));
  return new Date(Date.now() + delayMinutes * 60 * 1_000);
}

/**
 * Storage and PostgreSQL cannot participate in the same transaction. Keep a
 * random storage key in a private queue until Storage confirms its deletion.
 */
export async function enqueueCareerResumeCleanup(
  storageKey: string
): Promise<void> {
  await prisma.resumeCleanup.upsert({
    where: { storageKey },
    create: {
      storageKey,
      nextAttemptAt: new Date(),
    },
    update: {
      nextAttemptAt: new Date(),
    },
  });
}

export async function tryDeleteCareerResume(
  storageKey: string,
  maxAttempts = IMMEDIATE_DELETE_ATTEMPTS
): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      await deleteCareerResume(storageKey);
      return true;
    } catch {
      // The durable queue below records failures without logging private files.
    }
  }

  return false;
}

export async function processCareerResumeCleanups(
  limit = CLEANUP_BATCH_SIZE
): Promise<{ deleted: number; pending: number }> {
  const now = new Date();
  const pendingCleanups = await prisma.resumeCleanup.findMany({
    where: { nextAttemptAt: { lte: now } },
    orderBy: { nextAttemptAt: "asc" },
    take: Math.min(Math.max(limit, 1), CLEANUP_BATCH_SIZE),
  });

  let deleted = 0;
  let pending = 0;

  for (const cleanup of pendingCleanups) {
    const removed = await tryDeleteCareerResume(cleanup.storageKey, 1);

    if (removed) {
      await prisma.resumeCleanup.deleteMany({
        where: { storageKey: cleanup.storageKey },
      });
      deleted += 1;
      continue;
    }

    const attempts = cleanup.attempts + 1;
    await prisma.resumeCleanup.updateMany({
      where: {
        storageKey: cleanup.storageKey,
        attempts: cleanup.attempts,
      },
      data: {
        attempts,
        nextAttemptAt: nextCleanupAttempt(attempts),
      },
    });
    pending += 1;
  }

  return { deleted, pending };
}
