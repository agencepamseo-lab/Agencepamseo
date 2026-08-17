ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "geographic_scope" text DEFAULT 'Bobo-Dioulasso' NOT NULL;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "subscription_status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "subscription_started_at" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "subscription_expires_at" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "payment_status" text DEFAULT 'paid' NOT NULL;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "last_payment_at" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "next_payment_due_at" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "last_assigned_at" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "rotation_index" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "partners_payment_status_idx" ON "partners" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "partners_subscription_status_idx" ON "partners" USING btree ("subscription_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "partners_geographic_scope_idx" ON "partners" USING btree ("geographic_scope");
