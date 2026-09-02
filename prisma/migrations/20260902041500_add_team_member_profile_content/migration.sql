-- Profile-detail content is additive and independent from the directory
-- completeness rules. Existing published records remain valid while gaining
-- an editable long-form About section seeded from their current biography.
ALTER TABLE "TeamMember"
  ADD COLUMN IF NOT EXISTS "about" TEXT,
  ADD COLUMN IF NOT EXISTS "highlights" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "experience" TEXT;

-- Keep an administrator-authored About value intact if this migration is
-- replayed. Rows without a biography intentionally remain null.
UPDATE "TeamMember"
SET "about" = "bio"
WHERE "about" IS NULL
  AND "bio" IS NOT NULL;
