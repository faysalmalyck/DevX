-- Sales portal foundation. This migration is additive: it creates only new
-- enums/tables/indexes and adds the nullable Admin.agentCode column. The
-- existing Admin, Role, Permission, session, audit, and TeamMember records are
-- deliberately preserved.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LeadStatus') THEN
    CREATE TYPE "LeadStatus" AS ENUM (
      'NEW',
      'CONTACTED',
      'QUALIFIED',
      'PROPOSAL_SENT',
      'NEGOTIATION',
      'WON',
      'LOST',
      'DUPLICATE'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LeadSource') THEN
    CREATE TYPE "LeadSource" AS ENUM (
      'AGENT_REFERRAL',
      'AGENT_MANUAL',
      'WEBSITE_CONTACT',
      'WEBSITE_CONSULTATION',
      'WEBSITE_PRICING',
      'WHATSAPP',
      'IMPORTED',
      'OTHER'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LeadCaptureSurface') THEN
    CREATE TYPE "LeadCaptureSurface" AS ENUM (
      'CONTACT',
      'CONSULTATION',
      'PRICING',
      'MANUAL',
      'IMPORT',
      'OTHER'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LeadActivityType') THEN
    CREATE TYPE "LeadActivityType" AS ENUM (
      'CREATED',
      'STATUS_CHANGE',
      'NOTE',
      'ASSIGNMENT',
      'CONTACT_ATTEMPT',
      'FOLLOW_UP_CREATED',
      'FOLLOW_UP_COMPLETED',
      'MARKED_DUPLICATE'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FollowUpStatus') THEN
    CREATE TYPE "FollowUpStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');
  END IF;
END $$;

ALTER TABLE "Admin"
  ADD COLUMN IF NOT EXISTS "agentCode" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Admin_agentCode_key"
  ON "Admin"("agentCode");

CREATE TABLE IF NOT EXISTS "Lead" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "company" TEXT,
  "message" TEXT,
  "budgetRange" TEXT,
  "estimatedValue" DECIMAL(12, 2),
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "source" "LeadSource" NOT NULL DEFAULT 'WEBSITE_CONTACT',
  "captureSurface" "LeadCaptureSurface",
  "assignedAgentId" TEXT,
  "createdByAgentId" TEXT,
  "referralAgentId" TEXT,
  "referralAgentCode" TEXT,
  "duplicateOfId" TEXT,
  "lostReason" TEXT,
  "statusChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastContactedAt" TIMESTAMP(3),
  "wonAt" TIMESTAMP(3),
  "lostAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Lead_assignedAgentId_fkey"
    FOREIGN KEY ("assignedAgentId") REFERENCES "Admin"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Lead_createdByAgentId_fkey"
    FOREIGN KEY ("createdByAgentId") REFERENCES "Admin"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Lead_referralAgentId_fkey"
    FOREIGN KEY ("referralAgentId") REFERENCES "Admin"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Lead_duplicateOfId_fkey"
    FOREIGN KEY ("duplicateOfId") REFERENCES "Lead"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Lead_status_createdAt_idx"
  ON "Lead"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "Lead_assignedAgentId_status_deletedAt_idx"
  ON "Lead"("assignedAgentId", "status", "deletedAt");
CREATE INDEX IF NOT EXISTS "Lead_referralAgentId_createdAt_idx"
  ON "Lead"("referralAgentId", "createdAt");
CREATE INDEX IF NOT EXISTS "Lead_referralAgentCode_idx"
  ON "Lead"("referralAgentCode");
CREATE INDEX IF NOT EXISTS "Lead_email_deletedAt_idx"
  ON "Lead"("email", "deletedAt");
CREATE INDEX IF NOT EXISTS "Lead_source_createdAt_idx"
  ON "Lead"("source", "createdAt");
CREATE INDEX IF NOT EXISTS "Lead_deletedAt_idx"
  ON "Lead"("deletedAt");

CREATE TABLE IF NOT EXISTS "LeadActivity" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "actorId" TEXT,
  "type" "LeadActivityType" NOT NULL,
  "note" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LeadActivity_leadId_fkey"
    FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "LeadActivity_actorId_fkey"
    FOREIGN KEY ("actorId") REFERENCES "Admin"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "LeadActivity_leadId_createdAt_idx"
  ON "LeadActivity"("leadId", "createdAt");
CREATE INDEX IF NOT EXISTS "LeadActivity_actorId_createdAt_idx"
  ON "LeadActivity"("actorId", "createdAt");

CREATE TABLE IF NOT EXISTS "LeadFollowUp" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "assignedAgentId" TEXT NOT NULL,
  "createdById" TEXT NOT NULL,
  "dueAt" TIMESTAMP(3) NOT NULL,
  "status" "FollowUpStatus" NOT NULL DEFAULT 'PENDING',
  "note" TEXT,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "LeadFollowUp_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LeadFollowUp_leadId_fkey"
    FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "LeadFollowUp_assignedAgentId_fkey"
    FOREIGN KEY ("assignedAgentId") REFERENCES "Admin"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "LeadFollowUp_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "Admin"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "LeadFollowUp_assignedAgentId_status_dueAt_idx"
  ON "LeadFollowUp"("assignedAgentId", "status", "dueAt");
CREATE INDEX IF NOT EXISTS "LeadFollowUp_leadId_dueAt_idx"
  ON "LeadFollowUp"("leadId", "dueAt");
CREATE INDEX IF NOT EXISTS "LeadFollowUp_deletedAt_idx"
  ON "LeadFollowUp"("deletedAt");

CREATE TABLE IF NOT EXISTS "LeadCaptureRateLimit" (
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  "windowStartedAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LeadCaptureRateLimit_pkey" PRIMARY KEY ("key")
);

CREATE INDEX IF NOT EXISTS "LeadCaptureRateLimit_windowStartedAt_idx"
  ON "LeadCaptureRateLimit"("windowStartedAt");

-- The browser does not query these sensitive records through Supabase's Data
-- API. Prisma accesses them from server-authorized route handlers only.
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeadActivity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeadFollowUp" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeadCaptureRateLimit" ENABLE ROW LEVEL SECURITY;
