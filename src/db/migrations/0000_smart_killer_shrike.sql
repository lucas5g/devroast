-- Migration for create-roast feature
-- Handles existing schema

DO $$ BEGIN
CREATE TYPE "public"."roast_mode_enum" AS ENUM('normal', 'spicy');
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- Make userId optional in code_submissions
ALTER TABLE "code_submissions" ALTER COLUMN "user_id" DROP NOT NULL;
--> statement-breakpoint

-- Set default for isAnonymous to true
ALTER TABLE "code_submissions" ALTER COLUMN "is_anonymous" SET DEFAULT true;
--> statement-breakpoint

-- Add new columns to roasts table (nullable first, will update existing)
ALTER TABLE "roasts" ADD COLUMN IF NOT EXISTS "code" text;
ALTER TABLE "roasts" ADD COLUMN IF NOT EXISTS "language" varchar(20);
ALTER TABLE "roasts" ADD COLUMN IF NOT EXISTS "verdict" varchar(50);
--> statement-breakpoint

-- Create roast_issues table
CREATE TABLE IF NOT EXISTS "roast_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"type" varchar(20) NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint

-- Create roast_fixes table
CREATE TABLE IF NOT EXISTS "roast_fixes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"diff" text NOT NULL
);
--> statement-breakpoint

-- Add foreign keys
ALTER TABLE "roast_issues" ADD CONSTRAINT "roast_issues_roast_id_roasts_id_fk" 
    FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

ALTER TABLE "roast_fixes" ADD CONSTRAINT "roast_fixes_roast_id_roasts_id_fk" 
    FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;
