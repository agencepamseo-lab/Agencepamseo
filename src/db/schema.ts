import { pgTable, text, integer, boolean, json, timestamp, index } from 'drizzle-orm/pg-core';

// 1. Users / Operators
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('operator'), // admin | operator | partner
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// 2. Sites (Acquisition Sites / Microsites)
export const sites = pgTable('sites', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  theme: text('theme').notNull(), // formation | immobilier | solaire | agriculture | forage
  city: text('city').notNull(),
  domain: text('domain').notNull(),
  status: text('status').notNull().default('active'), // active | draft | paused
  headline: text('headline').notNull(),
  subheadline: text('subheadline').notNull(),
  features: json('features').$type<string[]>().notNull(),
  chatbotGreeting: text('chatbot_greeting').notNull(),
  chatbotPersona: text('chatbot_persona').notNull(),
  faqs: json('faqs').$type<{ question: string; answer: string }[]>().notNull(),
  leadsCount: integer('leads_count').notNull().default(0),
  isCILCompliant: boolean('is_cil_compliant').notNull().default(true),
  complianceRating: integer('compliance_rating').notNull().default(90),
  complianceReport: json('compliance_report').$type<{
    justification: string;
    consentNotice: string;
    legalMentions: string;
    retractionRights: string;
    warnings: string[];
  }>().notNull(),
  apiKey: text('api_key'), // Unique API Key for external site access
  brandedConfig: json('branded_config').$type<{
    logoUrl?: string;
    brandName?: string;
    slogan?: string;
    primaryColor?: string;
    accentColor?: string;
    customTitle?: string;
    ctaText?: string;
    tone?: string;
    contactInfo?: { phone?: string; email?: string; address?: string };
    supportedFormTypes?: string[];
    questions?: {
      id: string;
      label: string;
      type: string;
      required?: boolean;
      options?: string[];
      placeholder?: string;
      helpText?: string;
    }[];
    defaultCampaignId?: string;
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => [
  index('sites_domain_idx').on(table.domain),
  index('sites_status_idx').on(table.status)
]);

// 3. Campaigns (Campaign Intelligence / Campaign Mapping)
export const campaigns = pgTable('campaigns', {
  id: text('id').primaryKey(),
  siteId: text('site_id').references(() => sites.id),
  name: text('name').notNull(),
  targetSegment: text('target_segment').notNull().default('PROJECT'),
  targetCity: text('target_city').notNull(),
  sector: text('sector').notNull(),
  offer: text('offer'),
  status: text('status').notNull().default('ACTIVE'), // ACTIVE | PAUSED | COMPLETED
  budget: integer('budget').default(150000), // Budget allocated in FCFA
  landingPage: text('landing_page'), // Primary landing page URL
  source: text('source').default('google_ads'), // Main acquisition channel
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => [
  index('campaigns_site_id_idx').on(table.siteId),
  index('campaigns_status_idx').on(table.status),
  index('campaigns_created_at_idx').on(table.createdAt)
]);

// 4. Leads
export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  siteId: text('site_id').notNull().references(() => sites.id),
  campaignId: text('campaign_id').references(() => campaigns.id),
  siteTitle: text('site_title').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  city: text('city').notNull(),
  rawMessage: text('raw_message').notNull(),
  status: text('status').notNull().default('new'), // new | contacted | sold | rejected
  score: integer('score').notNull().default(50),
  summarizedNeed: text('summarized_need').notNull(),
  budget: text('budget').notNull().default('Non spécifié'),
  urgency: text('urgency').notNull().default('Moyen'),
  keyPainPoint: text('key_pain_point').notNull(),
  suggestedAction: text('suggested_action').notNull(),
  responseDraft: text('response_draft').notNull(),
  assignedPartnerId: text('assigned_partner_id').references(() => partners.id),
  createdAt: text('created_at').notNull(),
  
  // Origin & Acquisition Tracking
  source: text('source').default('organic_seo'),
  landingPage: text('landing_page'),
  formType: text('form_type').default('contact'),
  acquisitionPath: text('acquisition_path'),
  interactionHistory: json('interaction_history').$type<{
    timestamp: string;
    action: string;
    landingPage?: string;
    formType?: string;
    campaignId?: string;
    details?: string;
  }[]>(),

  consentCILChecked: boolean('consent_cil_checked').notNull().default(true),
  consentPartnerChecked: boolean('consent_partner_checked').notNull().default(true),
  ipAddress: text('ip_address').notNull(),
  isFlaggedAnomaly: boolean('is_flagged_anomaly').notNull().default(false),
  securityRiskLevel: text('security_risk_level').notNull().default('none'),
  securityLogs: json('security_logs').$type<string[]>().notNull(),
  
  distributionChannels: json('distribution_channels').$type<{
    email: { sent: boolean; sentAt: string | null; recipient: string };
    whatsapp: { sent: boolean; sentAt: string | null; formattedMessage: string };
    telegram: { sent: boolean; sentAt: string | null; botCommandTriggered: string };
  }>().notNull(),
  distributionType: text('distribution_type').notNull().default('standard')
}, (table) => [
  index('leads_phone_idx').on(table.phone),
  index('leads_email_idx').on(table.email),
  index('leads_site_id_idx').on(table.siteId),
  index('leads_campaign_id_idx').on(table.campaignId),
  index('leads_status_idx').on(table.status),
  index('leads_created_at_idx').on(table.createdAt),
  index('leads_partner_id_idx').on(table.assignedPartnerId),
  index('leads_source_idx').on(table.source)
]);

// 5. Partners
export const partners = pgTable('partners', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sector: text('sector').notNull(),
  city: text('city').notNull(),
  geographicScope: text('geographic_scope').notNull().default('Bobo-Dioulasso'),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  status: text('status').notNull().default('active'), // discovery | active | suspended
  
  // Subscription & Payment Model
  subscriptionStatus: text('subscription_status').notNull().default('active'), // active | expired | canceled
  subscriptionPlan: text('subscription_plan').notNull().default('Business'), // Starter | Business | Premium
  subscriptionStartedAt: text('subscription_started_at'),
  subscriptionExpiresAt: text('subscription_expires_at'),
  paymentStatus: text('payment_status').notNull().default('paid'), // paid | pending | overdue
  lastPaymentAt: text('last_payment_at'),
  nextPaymentDueAt: text('next_payment_due_at'),

  // Quotas & Performance
  leadsReceived: integer('leads_received').notNull().default(0),
  maxLeadsPerMonth: integer('max_leads_per_month').notNull().default(20),
  revenueGenerated: integer('revenue_generated').notNull().default(0),
  exclusiveAccess: boolean('exclusive_access').notNull().default(false),
  
  // Rotation & Fairness
  lastAssignedAt: text('last_assigned_at'),
  rotationIndex: integer('rotation_index').notNull().default(0),

  apiKey: text('api_key'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  index('partners_sector_idx').on(table.sector),
  index('partners_status_idx').on(table.status),
  index('partners_payment_status_idx').on(table.paymentStatus),
  index('partners_subscription_status_idx').on(table.subscriptionStatus),
  index('partners_geographic_scope_idx').on(table.geographicScope)
]);

// 6. Activity Logs
export const activityLogs = pgTable('activity_logs', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  message: text('message').notNull(),
  timestamp: text('timestamp').notNull()
}, (table) => [
  index('activity_logs_timestamp_idx').on(table.timestamp),
  index('activity_logs_type_idx').on(table.type)
]);

// 7. Market Trends
export const marketTrends = pgTable('market_trends', {
  id: text('id').primaryKey(),
  keyword: text('keyword').notNull(),
  sector: text('sector').notNull(),
  volume: text('volume').notNull(),
  growth: text('growth').notNull(),
  description: text('description').notNull(),
  opportunity: text('opportunity').notNull()
});

// 8. Security Events
export const securityEvents = pgTable('security_events', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  eventType: text('event_type').notNull(),
  description: text('description').notNull(),
  severity: text('severity').notNull()
}, (table) => [
  index('security_events_timestamp_idx').on(table.timestamp),
  index('security_events_event_type_idx').on(table.eventType),
  index('security_events_severity_idx').on(table.severity)
]);
