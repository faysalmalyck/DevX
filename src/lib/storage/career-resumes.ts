import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

import {
  ACCEPTED_RESUME_TYPES,
  MAX_RESUME_BYTES,
  sanitizeResumeFilename,
  type ResumeExtension,
  type ValidatedResume,
} from "@/lib/validations/application";

export const CAREER_RESUMES_BUCKET = "career-resumes";

const RESUME_SIGNED_URL_TTL_SECONDS = 60;
const resumeStorageKeyPattern =
  /^applications\/\d{4}\/\d{2}\/[a-f0-9]{48}\.(pdf|doc|docx)$/;

export class CareerResumeStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CareerResumeStorageError";
  }
}

let bucketInitialization: Promise<void> | undefined;

function getSupabaseServiceClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new CareerResumeStorageError("Resume storage is not configured.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

function isMissingBucketError(error: { status?: number }): boolean {
  return error.status === 404;
}

async function configureCareerResumesBucket(client: SupabaseClient): Promise<void> {
  const { error } = await client.storage.updateBucket(CAREER_RESUMES_BUCKET, {
    public: false,
    fileSizeLimit: MAX_RESUME_BYTES,
    allowedMimeTypes: ACCEPTED_RESUME_TYPES.map((resumeType) => resumeType.mimeType),
  });

  if (error) {
    throw new CareerResumeStorageError("Resume storage could not be configured.");
  }
}

async function createOrConfigureCareerResumesBucket(
  client: SupabaseClient
): Promise<void> {
  const existingBucket = await client.storage.getBucket(CAREER_RESUMES_BUCKET);

  if (existingBucket.data) {
    await configureCareerResumesBucket(client);
    return;
  }

  if (existingBucket.error && !isMissingBucketError(existingBucket.error)) {
    throw new CareerResumeStorageError("Resume storage is unavailable.");
  }

  const createdBucket = await client.storage.createBucket(CAREER_RESUMES_BUCKET, {
    public: false,
    fileSizeLimit: MAX_RESUME_BYTES,
    allowedMimeTypes: ACCEPTED_RESUME_TYPES.map((resumeType) => resumeType.mimeType),
  });

  if (!createdBucket.error) return;

  // Another server instance can create the bucket between our lookup and create.
  const bucketAfterCreateRace = await client.storage.getBucket(CAREER_RESUMES_BUCKET);
  if (bucketAfterCreateRace.data) {
    await configureCareerResumesBucket(client);
    return;
  }

  throw new CareerResumeStorageError("Resume storage could not be initialized.");
}

export async function ensureCareerResumesBucket(): Promise<void> {
  if (!bucketInitialization) {
    bucketInitialization = createOrConfigureCareerResumesBucket(
      getSupabaseServiceClient()
    );
  }

  try {
    await bucketInitialization;
  } catch (error) {
    bucketInitialization = undefined;
    throw error;
  }
}

function createStorageKey(extension: ResumeExtension, now = new Date()): string {
  const year = now.getUTCFullYear().toString();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const randomId = randomBytes(24).toString("hex");

  return `applications/${year}/${month}/${randomId}.${extension}`;
}

function assertSafeStorageKey(storageKey: string): void {
  if (!resumeStorageKeyPattern.test(storageKey)) {
    throw new CareerResumeStorageError("Invalid resume storage key.");
  }
}

export async function uploadCareerResume(
  resume: ValidatedResume
): Promise<{ storageKey: string }> {
  await ensureCareerResumesBucket();

  const client = getSupabaseServiceClient();
  const storageKey = createStorageKey(resume.extension);

  try {
    const { error } = await client.storage
      .from(CAREER_RESUMES_BUCKET)
      .upload(storageKey, resume.contents, {
        cacheControl: "0",
        contentType: resume.mimeType,
        upsert: false,
      });

    if (error) {
      throw new CareerResumeStorageError("Resume upload failed.");
    }

    return { storageKey };
  } catch (error) {
    // A transport error can occur after Storage persisted the object. Remove the
    // randomized key before surfacing the failure so it cannot become an orphan.
    await deleteCareerResume(storageKey).catch(() => undefined);

    if (error instanceof CareerResumeStorageError) {
      throw error;
    }

    throw new CareerResumeStorageError("Resume upload failed.");
  }
}

export async function deleteCareerResume(storageKey: string): Promise<void> {
  assertSafeStorageKey(storageKey);
  await ensureCareerResumesBucket();

  const { error } = await getSupabaseServiceClient()
    .storage.from(CAREER_RESUMES_BUCKET)
    .remove([storageKey]);

  if (error) {
    throw new CareerResumeStorageError("Resume deletion failed.");
  }
}

/**
 * Call only after server-side admin authorization. The generated URL is scoped
 * to the private bucket and intentionally expires quickly.
 */
export async function getResumeDownloadUrl(
  storageKey: string,
  originalFilename?: string
): Promise<string> {
  assertSafeStorageKey(storageKey);
  await ensureCareerResumesBucket();

  const downloadName = originalFilename
    ? sanitizeResumeFilename(originalFilename)
    : true;
  const { data, error } = await getSupabaseServiceClient()
    .storage.from(CAREER_RESUMES_BUCKET)
    .createSignedUrl(storageKey, RESUME_SIGNED_URL_TTL_SECONDS, {
      download: downloadName,
    });

  if (error || !data) {
    throw new CareerResumeStorageError("Resume download URL could not be created.");
  }

  return data.signedUrl;
}
