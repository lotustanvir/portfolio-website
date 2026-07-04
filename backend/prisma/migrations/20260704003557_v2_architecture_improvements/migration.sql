-- ─────────────────────────────────────────────────
-- Migration: v2_architecture_improvements
-- ─────────────────────────────────────────────────
-- Normalizes technologies, adds Blog/Subscriber/
-- Resume/SocialLink/WebsiteSetting, improves
-- indexes and constraints on existing tables.
--
-- ⚠ DATA PRESERVATION: Technologies are extracted
-- from the old String[] columns before they are
-- dropped. No existing data is lost.
-- ─────────────────────────────────────────────────

-- ─────────────────────────────────────────────────
-- 1. Create New Tables
-- ─────────────────────────────────────────────────

CREATE TABLE "technologies" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "category" TEXT,
    "color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "project_technologies" (
    "project_id" UUID NOT NULL,
    "technology_id" UUID NOT NULL,
    CONSTRAINT "project_technologies_pkey" PRIMARY KEY ("project_id","technology_id")
);

CREATE TABLE "experience_technologies" (
    "experience_id" UUID NOT NULL,
    "technology_id" UUID NOT NULL,
    CONSTRAINT "experience_technologies_pkey" PRIMARY KEY ("experience_id","technology_id")
);

CREATE TABLE "blogs" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "thumbnail" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "reading_time" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "subscribers" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "is_subscribed" BOOLEAN NOT NULL DEFAULT true,
    "verification_token" TEXT,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "resumes" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "social_links" (
    "id" UUID NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "website_settings" (
    "id" UUID NOT NULL,
    "site_title" TEXT,
    "site_description" TEXT,
    "hero_title" TEXT,
    "hero_subtitle" TEXT,
    "hero_image" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "resume_url" TEXT,
    "theme_color" TEXT,
    "logo" TEXT,
    "favicon" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "website_settings_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────────
-- 2. Data Migration: Extract Technologies
-- ─────────────────────────────────────────────────
-- Safely migrates existing String[] data from
-- projects.technologies and experiences.technologies
-- into the normalized Technology table, then links
-- through the junction tables.
-- ─────────────────────────────────────────────────

-- 2a. Extract distinct technology names into Technology table
INSERT INTO technologies (id, name, slug, created_at, updated_at)
SELECT
  gen_random_uuid(),
  tech_name,
  TRIM(BOTH '-' FROM
    REGEXP_REPLACE(
      REGEXP_REPLACE(LOWER(tech_name), '[^\w\s-]', '', 'g'),
      '[\s_]+', '-', 'g'
    )
  ),
  NOW(),
  NOW()
FROM (
  SELECT DISTINCT unnest(technologies) AS tech_name FROM projects
  UNION
  SELECT DISTINCT unnest(technologies) AS tech_name FROM experiences
) AS all_techs;

-- 2b. Link projects → technologies
INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id
FROM projects p
CROSS JOIN LATERAL unnest(p.technologies) AS pt(name)
JOIN technologies t ON t.name = pt.name;

-- 2c. Link experiences → technologies
INSERT INTO experience_technologies (experience_id, technology_id)
SELECT e.id, t.id
FROM experiences e
CROSS JOIN LATERAL unnest(e.technologies) AS et(name)
JOIN technologies t ON t.name = et.name;

-- ─────────────────────────────────────────────────
-- 3. Rename Columns
-- ─────────────────────────────────────────────────

ALTER TABLE "projects" RENAME COLUMN "liveDemo" TO "live_demo";

-- ─────────────────────────────────────────────────
-- 4. Drop Legacy String[] Columns
-- ─────────────────────────────────────────────────
-- Safe: data has been migrated to junction tables above.

ALTER TABLE "projects" DROP COLUMN "technologies";
ALTER TABLE "experiences" DROP COLUMN "technologies";

-- ─────────────────────────────────────────────────
-- 5. Create Indexes
-- ─────────────────────────────────────────────────

-- New table indexes
CREATE UNIQUE INDEX "technologies_name_key" ON "technologies"("name");
CREATE UNIQUE INDEX "technologies_slug_key" ON "technologies"("slug");
CREATE INDEX "technologies_category_idx" ON "technologies"("category");
CREATE INDEX "technologies_name_idx" ON "technologies"("name");

CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");
CREATE INDEX "blogs_is_published_idx" ON "blogs"("is_published");
CREATE INDEX "blogs_category_idx" ON "blogs"("category");
CREATE INDEX "blogs_published_at_idx" ON "blogs"("published_at");
CREATE INDEX "blogs_created_at_idx" ON "blogs"("created_at");
CREATE INDEX "blogs_tags_idx" ON "blogs" USING GIN ("tags");

CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");
CREATE INDEX "subscribers_is_subscribed_idx" ON "subscribers"("is_subscribed");
CREATE INDEX "subscribers_verified_at_idx" ON "subscribers"("verified_at");

CREATE INDEX "resumes_is_active_idx" ON "resumes"("is_active");
CREATE INDEX "resumes_uploaded_at_idx" ON "resumes"("uploaded_at");
-- Partial unique index: enforces only one active resume at any time
CREATE UNIQUE INDEX "resumes_single_active_idx" ON "resumes"("is_active") WHERE is_active = true;

CREATE UNIQUE INDEX "social_links_platform_key" ON "social_links"("platform");
CREATE INDEX "social_links_display_order_idx" ON "social_links"("display_order");
CREATE INDEX "social_links_is_visible_idx" ON "social_links"("is_visible");

-- Improved indexes on existing tables
CREATE INDEX "admins_email_idx" ON "admins"("email");
CREATE INDEX "certificates_issue_date_idx" ON "certificates"("issue_date");
CREATE INDEX "certificates_issuer_idx" ON "certificates"("issuer");
CREATE INDEX "educations_start_year_idx" ON "educations"("start_year");
CREATE INDEX "educations_institution_idx" ON "educations"("institution");
CREATE INDEX "experiences_company_idx" ON "experiences"("company");
CREATE INDEX "messages_email_idx" ON "messages"("email");
CREATE INDEX "projects_created_at_idx" ON "projects"("created_at");
CREATE UNIQUE INDEX "skills_name_category_key" ON "skills"("name", "category");
CREATE INDEX "testimonials_created_at_idx" ON "testimonials"("created_at");
CREATE INDEX "visitors_country_city_idx" ON "visitors"("country", "city");

-- ─────────────────────────────────────────────────
-- 6. Add Foreign Keys
-- ─────────────────────────────────────────────────

ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_technology_id_fkey" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "experience_technologies" ADD CONSTRAINT "experience_technologies_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "experience_technologies" ADD CONSTRAINT "experience_technologies_technology_id_fkey" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
