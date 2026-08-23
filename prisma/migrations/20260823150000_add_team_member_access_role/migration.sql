DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TeamMemberAccessRole') THEN
    CREATE TYPE "TeamMemberAccessRole" AS ENUM ('ADMINISTRATOR', 'SALES_MANAGER', 'SALES_AGENT');
  END IF;
END $$;

ALTER TABLE "TeamMember"
  ADD COLUMN IF NOT EXISTS "accessRole" "TeamMemberAccessRole";

UPDATE "TeamMember"
SET "accessRole" = CASE "salesRole"
  WHEN 'SALES_MANAGER' THEN 'SALES_MANAGER'::"TeamMemberAccessRole"
  WHEN 'SALES_AGENT' THEN 'SALES_AGENT'::"TeamMemberAccessRole"
  ELSE NULL
END
WHERE "accessRole" IS NULL AND "salesRole" IS NOT NULL;

UPDATE "TeamMember" AS tm
SET "accessRole" = 'ADMINISTRATOR'::"TeamMemberAccessRole"
FROM "Admin" AS a
JOIN "Role" AS r ON r."id" = a."roleId"
WHERE tm."adminId" = a."id"
  AND tm."accessRole" IS NULL
  AND tm."salesRole" IS NULL
  AND r."name" = 'Administrator';
