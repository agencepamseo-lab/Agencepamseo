CREATE TABLE "activity_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"timestamp" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"site_id" text,
	"name" text NOT NULL,
	"target_segment" text DEFAULT 'PROJECT' NOT NULL,
	"target_city" text NOT NULL,
	"sector" text NOT NULL,
	"offer" text,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"budget" integer DEFAULT 150000,
	"landing_page" text,
	"source" text DEFAULT 'google_ads',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"site_id" text NOT NULL,
	"campaign_id" text,
	"site_title" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"city" text NOT NULL,
	"raw_message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"score" integer DEFAULT 50 NOT NULL,
	"summarized_need" text NOT NULL,
	"budget" text DEFAULT 'Non spécifié' NOT NULL,
	"urgency" text DEFAULT 'Moyen' NOT NULL,
	"key_pain_point" text NOT NULL,
	"suggested_action" text NOT NULL,
	"response_draft" text NOT NULL,
	"assigned_partner_id" text,
	"created_at" text NOT NULL,
	"source" text DEFAULT 'organic_seo',
	"landing_page" text,
	"form_type" text DEFAULT 'contact',
	"acquisition_path" text,
	"interaction_history" json,
	"consent_cil_checked" boolean DEFAULT true NOT NULL,
	"consent_partner_checked" boolean DEFAULT true NOT NULL,
	"ip_address" text NOT NULL,
	"is_flagged_anomaly" boolean DEFAULT false NOT NULL,
	"security_risk_level" text DEFAULT 'none' NOT NULL,
	"security_logs" json NOT NULL,
	"distribution_channels" json NOT NULL,
	"distribution_type" text DEFAULT 'standard' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market_trends" (
	"id" text PRIMARY KEY NOT NULL,
	"keyword" text NOT NULL,
	"sector" text NOT NULL,
	"volume" text NOT NULL,
	"growth" text NOT NULL,
	"description" text NOT NULL,
	"opportunity" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sector" text NOT NULL,
	"city" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"leads_received" integer DEFAULT 0 NOT NULL,
	"max_leads_per_month" integer DEFAULT 20 NOT NULL,
	"subscription_plan" text DEFAULT 'Business' NOT NULL,
	"revenue_generated" integer DEFAULT 0 NOT NULL,
	"exclusive_access" boolean DEFAULT false NOT NULL,
	"api_key" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "security_events" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" text NOT NULL,
	"event_type" text NOT NULL,
	"description" text NOT NULL,
	"severity" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"theme" text NOT NULL,
	"city" text NOT NULL,
	"domain" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"headline" text NOT NULL,
	"subheadline" text NOT NULL,
	"features" json NOT NULL,
	"chatbot_greeting" text NOT NULL,
	"chatbot_persona" text NOT NULL,
	"faqs" json NOT NULL,
	"leads_count" integer DEFAULT 0 NOT NULL,
	"is_cil_compliant" boolean DEFAULT true NOT NULL,
	"compliance_rating" integer DEFAULT 90 NOT NULL,
	"compliance_report" json NOT NULL,
	"api_key" text,
	"branded_config" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'operator' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_partner_id_partners_id_fk" FOREIGN KEY ("assigned_partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_logs_timestamp_idx" ON "activity_logs" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "activity_logs_type_idx" ON "activity_logs" USING btree ("type");--> statement-breakpoint
CREATE INDEX "campaigns_site_id_idx" ON "campaigns" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "campaigns_status_idx" ON "campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "campaigns_created_at_idx" ON "campaigns" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_phone_idx" ON "leads" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_site_id_idx" ON "leads" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "leads_campaign_id_idx" ON "leads" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_partner_id_idx" ON "leads" USING btree ("assigned_partner_id");--> statement-breakpoint
CREATE INDEX "leads_source_idx" ON "leads" USING btree ("source");--> statement-breakpoint
CREATE INDEX "partners_sector_idx" ON "partners" USING btree ("sector");--> statement-breakpoint
CREATE INDEX "partners_status_idx" ON "partners" USING btree ("status");--> statement-breakpoint
CREATE INDEX "security_events_timestamp_idx" ON "security_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "security_events_event_type_idx" ON "security_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "security_events_severity_idx" ON "security_events" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "sites_domain_idx" ON "sites" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "sites_status_idx" ON "sites" USING btree ("status");