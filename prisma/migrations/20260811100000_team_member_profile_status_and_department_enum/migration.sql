-- Keep publication state separate from whether a profile has the information
-- required for a complete directory entry.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TeamMemberDepartment') THEN
    CREATE TYPE "TeamMemberDepartment" AS ENUM (
      'EXECUTIVE',
      'ENGINEERING',
      'MOBILE',
      'SALES',
      'MARKETING'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TeamMemberProfileStatus') THEN
    CREATE TYPE "TeamMemberProfileStatus" AS ENUM ('INCOMPLETE', 'COMPLETE');
  END IF;
END $$;

-- Preserve an unsupported legacy value rather than discarding it when the
-- unrestricted text column is converted to the fixed department enum.
ALTER TABLE "TeamMember"
  ADD COLUMN IF NOT EXISTS "legacyDepartment" TEXT,
  ADD COLUMN IF NOT EXISTS "profileStatus" "TeamMemberProfileStatus" NOT NULL DEFAULT 'INCOMPLETE',
  ADD COLUMN IF NOT EXISTS "department_next" "TeamMemberDepartment";

UPDATE "TeamMember"
SET
  "department_next" = CASE lower(btrim("department"))
    WHEN 'executive' THEN 'EXECUTIVE'::"TeamMemberDepartment"
    WHEN 'engineering' THEN 'ENGINEERING'::"TeamMemberDepartment"
    WHEN 'mobile' THEN 'MOBILE'::"TeamMemberDepartment"
    WHEN 'sales' THEN 'SALES'::"TeamMemberDepartment"
    WHEN 'marketing' THEN 'MARKETING'::"TeamMemberDepartment"
    ELSE NULL
  END,
  "legacyDepartment" = CASE
    WHEN lower(btrim("department")) IN ('executive', 'engineering', 'mobile', 'sales', 'marketing') THEN NULL
    ELSE NULLIF(btrim("department"), '')
  END;

ALTER TABLE "TeamMember" DROP COLUMN "department";
ALTER TABLE "TeamMember" RENAME COLUMN "department_next" TO "department";

-- Drafts intentionally allow incomplete profile content. `slug` remains
-- unique when present; PostgreSQL permits multiple NULL draft slugs.
ALTER TABLE "TeamMember"
  ALTER COLUMN "name" DROP NOT NULL,
  ALTER COLUMN "slug" DROP NOT NULL,
  ALTER COLUMN "role" DROP NOT NULL,
  ALTER COLUMN "bio" DROP NOT NULL;

-- Backfill the derived value for existing records. All later mutations set it
-- with the shared server-side profile validation function.
UPDATE "TeamMember"
SET "profileStatus" = CASE
  WHEN "name" IS NOT NULL
    AND char_length(btrim("name")) BETWEEN 2 AND 160
    AND "slug" IS NOT NULL
    AND char_length(btrim("slug")) BETWEEN 2 AND 160
    AND btrim("slug") ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    AND "role" IS NOT NULL
    AND char_length(btrim("role")) BETWEEN 2 AND 160
    AND "department" IS NOT NULL
    AND "bio" IS NOT NULL
    AND char_length(btrim("bio")) BETWEEN 10 AND 5000
    AND (
      "email" IS NULL
      OR btrim("email") = ''
      OR (
        char_length(btrim("email")) <= 320
        AND btrim("email") ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
      )
    )
  THEN 'COMPLETE'::"TeamMemberProfileStatus"
  ELSE 'INCOMPLETE'::"TeamMemberProfileStatus"
END;

-- Match the public directory's active, published, complete-only query without
-- indexing incomplete drafts or soft-deleted records.
CREATE INDEX IF NOT EXISTS "TeamMember_published_complete_active_order_idx"
  ON "TeamMember" ("displayOrder", "createdAt" DESC)
  WHERE "deletedAt" IS NULL
    AND "status" = 'PUBLISHED'
    AND "profileStatus" = 'COMPLETE';
