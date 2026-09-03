-- Add aboutParagraph2 field to TeamMember
ALTER TABLE "TeamMember"
  ADD COLUMN IF NOT EXISTS "aboutParagraph2" TEXT;
