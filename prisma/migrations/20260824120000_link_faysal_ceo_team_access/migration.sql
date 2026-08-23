-- The original public TeamMember seed predates managed Team Access. Link the
-- known Faysal profile to the existing protected CEO identity without changing
-- that Admin account's role, credentials, status, or sessions.
UPDATE "TeamMember" AS tm
SET
  "email" = a."email",
  "adminId" = a."id",
  "accessRole" = 'ADMINISTRATOR'::"TeamMemberAccessRole",
  "salesRole" = NULL,
  "updatedAt" = CURRENT_TIMESTAMP
FROM "Admin" AS a
JOIN "Role" AS r ON r."id" = a."roleId"
WHERE tm."id" = 'team-faysal-mushtaq'
  AND tm."deletedAt" IS NULL
  AND tm."adminId" IS NULL
  AND tm."salesRole" IS NULL
  AND (tm."accessRole" IS NULL OR tm."accessRole" = 'ADMINISTRATOR'::"TeamMemberAccessRole")
  AND (tm."email" IS NULL OR LOWER(tm."email") = LOWER(a."email"))
  AND a."id" = 'ceo-faysal-mushtaq'
  AND a."deletedAt" IS NULL
  AND a."status" = 'ACTIVE'
  AND (r."name" = 'CEO' OR r."isSuperAdmin" = TRUE)
  AND NOT EXISTS (
    SELECT 1
    FROM "TeamMember" AS conflicting_member
    WHERE conflicting_member."id" <> tm."id"
      AND (
        conflicting_member."adminId" = a."id"
        OR LOWER(conflicting_member."email") = LOWER(a."email")
      )
  );
