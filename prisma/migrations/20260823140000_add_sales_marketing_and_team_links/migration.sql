-- Sales and Marketing expansion. This migration is additive: it adds only
-- nullable TeamMember/Admin links, lead fields, enum values, and new email /
-- outreach records. Existing identities and historical records are preserved.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LeadContactType') THEN
    CREATE TYPE "LeadContactType" AS ENUM ('PROSPECT', 'VENDOR', 'PARTNER', 'OTHER');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SalesTeamRole') THEN
    CREATE TYPE "SalesTeamRole" AS ENUM ('SALES_MANAGER', 'SALES_AGENT');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LeadEmailStatus') THEN
    CREATE TYPE "LeadEmailStatus" AS ENUM ('DRAFT', 'QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED', 'CANCELLED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VendorOutreachBatchStatus') THEN
    CREATE TYPE "VendorOutreachBatchStatus" AS ENUM ('DRAFT', 'QUEUED', 'PROCESSING', 'COMPLETED', 'PARTIALLY_FAILED', 'CANCELLED');
  END IF;
END $$;

ALTER TYPE "LeadActivityType" ADD VALUE IF NOT EXISTS 'EMAIL_DRAFTED';
ALTER TYPE "LeadActivityType" ADD VALUE IF NOT EXISTS 'EMAIL_QUEUED';
ALTER TYPE "LeadActivityType" ADD VALUE IF NOT EXISTS 'EMAIL_SENT';
ALTER TYPE "LeadActivityType" ADD VALUE IF NOT EXISTS 'EMAIL_FAILED';
ALTER TYPE "LeadActivityType" ADD VALUE IF NOT EXISTS 'EMAIL_DELIVERED';
ALTER TYPE "LeadActivityType" ADD VALUE IF NOT EXISTS 'EMAIL_BOUNCED';
ALTER TYPE "LeadActivityType" ADD VALUE IF NOT EXISTS 'EMAIL_CANCELLED';
ALTER TYPE "LeadActivityType" ADD VALUE IF NOT EXISTS 'VENDOR_OUTREACH_BATCH_CREATED';

ALTER TABLE "Lead"
  ADD COLUMN IF NOT EXISTS "contactType" "LeadContactType" NOT NULL DEFAULT 'PROSPECT',
  ADD COLUMN IF NOT EXISTS "doNotEmail" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "doNotEmailReason" TEXT,
  ADD COLUMN IF NOT EXISTS "emailBouncedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Lead_contactType_assignedAgentId_deletedAt_idx"
  ON "Lead"("contactType", "assignedAgentId", "deletedAt");

ALTER TABLE "TeamMember"
  ADD COLUMN IF NOT EXISTS "salesRole" "SalesTeamRole",
  ADD COLUMN IF NOT EXISTS "adminId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "TeamMember_adminId_key"
  ON "TeamMember"("adminId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'TeamMember_adminId_fkey'
  ) THEN
    ALTER TABLE "TeamMember"
      ADD CONSTRAINT "TeamMember_adminId_fkey"
      FOREIGN KEY ("adminId") REFERENCES "Admin"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "VendorOutreachBatch" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "VendorOutreachBatchStatus" NOT NULL DEFAULT 'DRAFT',
  "createdByAdminId" TEXT NOT NULL,
  "queuedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "VendorOutreachBatch_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "VendorOutreachBatch_createdByAdminId_fkey"
    FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "VendorOutreachBatch_createdByAdminId_createdAt_idx"
  ON "VendorOutreachBatch"("createdByAdminId", "createdAt");
CREATE INDEX IF NOT EXISTS "VendorOutreachBatch_status_createdAt_idx"
  ON "VendorOutreachBatch"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "VendorOutreachBatch_deletedAt_idx"
  ON "VendorOutreachBatch"("deletedAt");

CREATE TABLE IF NOT EXISTS "LeadEmail" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "senderAdminId" TEXT NOT NULL,
  "toEmail" TEXT NOT NULL,
  "fromEmail" TEXT NOT NULL,
  "replyToEmail" TEXT,
  "subject" TEXT NOT NULL,
  "bodyText" TEXT NOT NULL,
  "bodyHtml" TEXT,
  "status" "LeadEmailStatus" NOT NULL DEFAULT 'DRAFT',
  "providerName" TEXT,
  "providerMessageId" TEXT,
  "idempotencyKey" TEXT NOT NULL,
  "retryOfId" TEXT,
  "outreachBatchId" TEXT,
  "queuedAt" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "deliveredAt" TIMESTAMP(3),
  "failedAt" TIMESTAMP(3),
  "bouncedAt" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "failureCode" TEXT,
  "failureMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "LeadEmail_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LeadEmail_leadId_fkey"
    FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "LeadEmail_senderAdminId_fkey"
    FOREIGN KEY ("senderAdminId") REFERENCES "Admin"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "LeadEmail_retryOfId_fkey"
    FOREIGN KEY ("retryOfId") REFERENCES "LeadEmail"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "LeadEmail_outreachBatchId_fkey"
    FOREIGN KEY ("outreachBatchId") REFERENCES "VendorOutreachBatch"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "LeadEmail_idempotencyKey_key"
  ON "LeadEmail"("idempotencyKey");
CREATE UNIQUE INDEX IF NOT EXISTS "LeadEmail_providerName_providerMessageId_key"
  ON "LeadEmail"("providerName", "providerMessageId");
CREATE INDEX IF NOT EXISTS "LeadEmail_leadId_createdAt_idx"
  ON "LeadEmail"("leadId", "createdAt");
CREATE INDEX IF NOT EXISTS "LeadEmail_senderAdminId_createdAt_idx"
  ON "LeadEmail"("senderAdminId", "createdAt");
CREATE INDEX IF NOT EXISTS "LeadEmail_status_createdAt_idx"
  ON "LeadEmail"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "LeadEmail_retryOfId_idx"
  ON "LeadEmail"("retryOfId");
CREATE INDEX IF NOT EXISTS "LeadEmail_outreachBatchId_createdAt_idx"
  ON "LeadEmail"("outreachBatchId", "createdAt");
CREATE INDEX IF NOT EXISTS "LeadEmail_deletedAt_idx"
  ON "LeadEmail"("deletedAt");

ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeadEmail" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VendorOutreachBatch" ENABLE ROW LEVEL SECURITY;
