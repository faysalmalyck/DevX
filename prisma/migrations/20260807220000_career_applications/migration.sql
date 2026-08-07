-- Complete the existing Career table without discarding its seeded content.
-- All application records and resumes are intentionally private and are accessed
-- only through server-authorized Prisma/Supabase operations.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CareerStatus') THEN
    CREATE TYPE "CareerStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ApplicationStatus') THEN
    CREATE TYPE "ApplicationStatus" AS ENUM (
      'NEW',
      'REVIEWING',
      'SHORTLISTED',
      'INTERVIEW',
      'REJECTED',
      'HIRED',
      'WITHDRAWN'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Career" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "category" TEXT,
  "location" TEXT NOT NULL,
  "employmentType" TEXT NOT NULL,
  "workMode" TEXT NOT NULL,
  "experience" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "overview" TEXT NOT NULL,
  "responsibilitiesDescription" TEXT NOT NULL DEFAULT '',
  "responsibilities" JSONB NOT NULL,
  "requirementsDescription" TEXT NOT NULL DEFAULT '',
  "requirements" JSONB NOT NULL,
  "preferredQualifications" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "hiringProcess" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "status" "CareerStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Career"
  ADD COLUMN IF NOT EXISTS "responsibilitiesDescription" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "requirementsDescription" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

ALTER TABLE "Career"
  ALTER COLUMN "responsibilitiesDescription" SET DEFAULT '',
  ALTER COLUMN "requirementsDescription" SET DEFAULT '';

-- Existing seeded data used nullable JSON columns for these two lists.
UPDATE "Career"
SET
  "responsibilities" = COALESCE("responsibilities", '[]'::jsonb),
  "requirements" = COALESCE("requirements", '[]'::jsonb),
  "preferredQualifications" = COALESCE("preferredQualifications", '[]'::jsonb),
  "hiringProcess" = COALESCE("hiringProcess", '[]'::jsonb);

ALTER TABLE "Career"
  ALTER COLUMN "responsibilities" SET NOT NULL,
  ALTER COLUMN "requirements" SET NOT NULL,
  ALTER COLUMN "preferredQualifications" SET NOT NULL,
  ALTER COLUMN "hiringProcess" SET NOT NULL;

DO $$
DECLARE
  current_status_type TEXT;
BEGIN
  SELECT "udt_name"
  INTO current_status_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'Career'
    AND column_name = 'status';

  IF current_status_type IS DISTINCT FROM 'CareerStatus' THEN
    ALTER TABLE "Career" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "Career"
      ALTER COLUMN "status" TYPE "CareerStatus"
      USING (
        CASE lower(COALESCE("status"::text, 'draft'))
          WHEN 'published' THEN 'PUBLISHED'::"CareerStatus"
          WHEN 'closed' THEN 'CLOSED'::"CareerStatus"
          WHEN 'archived' THEN 'ARCHIVED'::"CareerStatus"
          ELSE 'DRAFT'::"CareerStatus"
        END
      );
  END IF;
END $$;

ALTER TABLE "Career"
  ALTER COLUMN "status" SET DEFAULT 'DRAFT';

UPDATE "Career"
SET "publishedAt" = COALESCE("publishedAt", "createdAt")
WHERE "status" = 'PUBLISHED'::"CareerStatus";

CREATE UNIQUE INDEX IF NOT EXISTS "Career_slug_key" ON "Career"("slug");
CREATE INDEX IF NOT EXISTS "Career_status_displayOrder_idx" ON "Career"("status", "displayOrder");
CREATE INDEX IF NOT EXISTS "Career_category_status_displayOrder_idx" ON "Career"("category", "status", "displayOrder");

CREATE TABLE IF NOT EXISTS "Application" (
  "id" TEXT NOT NULL,
  "careerId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "currentLocation" TEXT NOT NULL,
  "yearsOfExperience" INTEGER NOT NULL,
  "linkedinUrl" TEXT,
  "portfolioUrl" TEXT,
  "coverLetter" TEXT NOT NULL,
  "resumeStorageKey" TEXT NOT NULL,
  "resumeOriginalFilename" TEXT NOT NULL,
  "resumeMimeType" TEXT NOT NULL,
  "resumeSize" INTEGER NOT NULL,
  "consentConfirmed" BOOLEAN NOT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
  "internalNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Application_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Application_careerId_fkey"
    FOREIGN KEY ("careerId") REFERENCES "Career"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Application_resumeStorageKey_key" ON "Application"("resumeStorageKey");
CREATE UNIQUE INDEX IF NOT EXISTS "Application_careerId_email_key" ON "Application"("careerId", "email");
CREATE INDEX IF NOT EXISTS "Application_careerId_createdAt_idx" ON "Application"("careerId", "createdAt");
CREATE INDEX IF NOT EXISTS "Application_status_createdAt_idx" ON "Application"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "Application_createdAt_idx" ON "Application"("createdAt");

CREATE TABLE IF NOT EXISTS "ApplicationRateLimit" (
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  "windowStartedAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ApplicationRateLimit_pkey" PRIMARY KEY ("key")
);

CREATE INDEX IF NOT EXISTS "ApplicationRateLimit_windowStartedAt_idx"
  ON "ApplicationRateLimit"("windowStartedAt");

CREATE TABLE IF NOT EXISTS "ResumeCleanup" (
  "storageKey" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ResumeCleanup_pkey" PRIMARY KEY ("storageKey")
);

CREATE INDEX IF NOT EXISTS "ResumeCleanup_nextAttemptAt_idx"
  ON "ResumeCleanup"("nextAttemptAt");

-- These tables are not exposed directly to browsers. The server database role
-- accesses them through Prisma; no anonymous/authenticated Data API policies
-- are created for sensitive candidate information.
ALTER TABLE "Career" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Application" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApplicationRateLimit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ResumeCleanup" ENABLE ROW LEVEL SECURITY;
