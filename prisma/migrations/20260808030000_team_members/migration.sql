DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TeamMemberStatus') THEN
    CREATE TYPE "TeamMemberStatus" AS ENUM ('DRAFT', 'PUBLISHED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "TeamMember" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "bio" TEXT NOT NULL,
  "image" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "linkedinUrl" TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "status" "TeamMemberStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "TeamMember_slug_key" ON "TeamMember"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "TeamMember_email_key" ON "TeamMember"("email");

-- These partial indexes match the soft-delete filters used by both admin and
-- public listings without indexing archived profiles.
CREATE INDEX IF NOT EXISTS "TeamMember_active_order_idx"
  ON "TeamMember"("displayOrder", "createdAt" DESC)
  WHERE "deletedAt" IS NULL;
CREATE INDEX IF NOT EXISTS "TeamMember_published_active_order_idx"
  ON "TeamMember"("status", "displayOrder", "createdAt" DESC)
  WHERE "deletedAt" IS NULL;

-- Team records are read through server-authorized Prisma queries, never the
-- browser Data API. Keep the public-schema table protected by default.
ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;
