-- AlterTable
ALTER TABLE "Invoice"
ADD COLUMN "quotedAt" TIMESTAMP(3);

-- Backfill from existing quote metadata when possible.
UPDATE "Invoice"
SET "quotedAt" = COALESCE(
  "quotedAt",
  CASE
    WHEN "expiresAt" IS NOT NULL THEN "expiresAt" - INTERVAL '30 minutes'
    ELSE "updatedAt"
  END
)
WHERE "depositAddress" IS NOT NULL;
