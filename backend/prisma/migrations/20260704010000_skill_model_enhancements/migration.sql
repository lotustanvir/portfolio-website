-- Skill Model Enhancements
-- Adds slug, color, is_visible, timestamps; makes name globally unique

-- Drop old composite unique constraint
DROP INDEX IF EXISTS "skills_name_category_key";

-- Add new columns (nullable first, then populate, then enforce NOT NULL)
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "color" TEXT;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "is_visible" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3);

-- Populate slug from name for existing rows
UPDATE "skills" SET "slug" = TRIM(BOTH '-' FROM REGEXP_REPLACE(REGEXP_REPLACE(LOWER("name"), '[^\w\s-]', '', 'g'), '[\s_]+', '-', 'g')) WHERE "slug" IS NULL;
UPDATE "skills" SET "updated_at" = NOW() WHERE "updated_at" IS NULL;

-- Handle duplicate slugs by appending a suffix
UPDATE "skills" SET "slug" = "slug" || '-' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)
WHERE "slug" IN (
  SELECT "slug" FROM "skills" GROUP BY "slug" HAVING COUNT(*) > 1
);

-- Make slug NOT NULL and unique
ALTER TABLE "skills" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "skills_slug_key" ON "skills"("slug");

-- Make name globally unique
CREATE UNIQUE INDEX IF NOT EXISTS "skills_name_key" ON "skills"("name");

-- Add is_visible index
CREATE INDEX IF NOT EXISTS "skills_is_visible_idx" ON "skills"("is_visible");

-- Make updated_at NOT NULL
ALTER TABLE "skills" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "skills" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
