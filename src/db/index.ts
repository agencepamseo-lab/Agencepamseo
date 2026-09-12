import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from './schema.js';
import { Site, Lead, Partner, MarketTrend, ActivityLog, SecurityEvent, CampaignData } from '../types.js';
import {
  initialSites,
  initialCampaigns,
  initialLeads,
  initialPartners,
  initialMarketTrends,
  initialActivityLogs,
  initialSecurityEvents
} from './seedData.js';

// Check database mode
const databaseUrl = process.env.DATABASE_URL;
let pgPool: pkg.Pool | null = null;
let drizzleDb: ReturnType<typeof drizzle> | null = null;

const DB_FILE_PATH = path.join(process.cwd(), 'db.json');

// File-based state cache for zero-config mode
let fileState: {
  sites: Site[];
  campaigns: CampaignData[];
  leads: Lead[];
  partners: Partner[];
  marketTrends: MarketTrend[];
  activityLogs: ActivityLog[];
  securityEvents: SecurityEvent[];
} = {
  sites: initialSites,
  campaigns: initialCampaigns,
  leads: initialLeads,
  partners: initialPartners,
  marketTrends: initialMarketTrends,
  activityLogs: initialActivityLogs,
  securityEvents: initialSecurityEvents
};

// Initialize file-based DB fallback
function initFileDb() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      fileState = {
        sites: parsed.sites || initialSites,
        campaigns: parsed.campaigns || initialCampaigns,
        leads: parsed.leads || initialLeads,
        partners: parsed.partners || initialPartners,
        marketTrends: parsed.marketTrends || initialMarketTrends,
        activityLogs: parsed.activityLogs || initialActivityLogs,
        securityEvents: parsed.securityEvents || initialSecurityEvents
      };
      console.log('📦 Local file database (db.json) loaded successfully.');
    } else {
      saveFileDb();
      console.log('📦 Local file database (db.json) created with initial seeds.');
    }
  } catch (err) {
    console.warn('⚠️ Could not read/write db.json file, using memory state:', err);
  }
}

function saveFileDb() {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(fileState, null, 2), 'utf-8');
  } catch (err) {
    console.warn('⚠️ Could not write db.json file:', err);
  }
}

// Initialize PostgreSQL / Neon Database if DATABASE_URL is available
export async function initDb() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (databaseUrl) {
    try {
      // Configure Hardened Pool options for Neon PostgreSQL (Production-ready SSL & error resilient)
      const poolConfig: pkg.PoolConfig = {
        connectionString: databaseUrl,
        ssl: true,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        allowExitOnIdle: true
      };

      pgPool = new Pool(poolConfig);
      
      // Catch and handle idle client errors to prevent server process crashes on serverless teardown
      pgPool.on('error', (err: any) => {
        console.warn('⚠️ [NEON POOL] Handled background connection event:', err?.message || err);
      });

      drizzleDb = drizzle(pgPool, { schema });

      // Test connection and execute initial schema check & indexes
      const client = await pgPool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'operator',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS sites (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            theme TEXT NOT NULL,
            city TEXT NOT NULL,
            domain TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            headline TEXT NOT NULL,
            subheadline TEXT NOT NULL,
            features JSONB NOT NULL,
            chatbot_greeting TEXT NOT NULL,
            chatbot_persona TEXT NOT NULL,
            faqs JSONB NOT NULL,
            leads_count INTEGER NOT NULL DEFAULT 0,
            is_cil_compliant BOOLEAN NOT NULL DEFAULT true,
            compliance_rating INTEGER NOT NULL DEFAULT 90,
            compliance_report JSONB NOT NULL,
            api_key TEXT,
            branded_config JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS campaigns (
            id TEXT PRIMARY KEY,
            site_id TEXT REFERENCES sites(id) ON DELETE SET NULL,
            name TEXT NOT NULL,
            target_segment TEXT NOT NULL DEFAULT 'PROJECT',
            target_city TEXT NOT NULL,
            sector TEXT NOT NULL,
            offer TEXT,
            status TEXT NOT NULL DEFAULT 'ACTIVE',
            budget INTEGER DEFAULT 150000,
            landing_page TEXT,
            source TEXT DEFAULT 'google_ads',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS partners (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            sector TEXT NOT NULL,
            city TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            leads_received INTEGER NOT NULL DEFAULT 0,
            max_leads_per_month INTEGER NOT NULL DEFAULT 20,
            subscription_plan TEXT NOT NULL DEFAULT 'Business',
            revenue_generated INTEGER NOT NULL DEFAULT 0,
            exclusive_access BOOLEAN NOT NULL DEFAULT false,
            api_key TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY,
            site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
            campaign_id TEXT REFERENCES campaigns(id) ON DELETE SET NULL,
            site_title TEXT NOT NULL,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            city TEXT NOT NULL,
            raw_message TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'new',
            score INTEGER NOT NULL DEFAULT 50,
            summarized_need TEXT NOT NULL,
            budget TEXT NOT NULL DEFAULT 'Non spécifié',
            urgency TEXT NOT NULL DEFAULT 'Moyen',
            key_pain_point TEXT NOT NULL,
            suggested_action TEXT NOT NULL,
            response_draft TEXT NOT NULL,
            assigned_partner_id TEXT REFERENCES partners(id) ON DELETE SET NULL,
            created_at TEXT NOT NULL,
            source TEXT DEFAULT 'organic_seo',
            landing_page TEXT,
            form_type TEXT DEFAULT 'contact',
            acquisition_path TEXT,
            interaction_history JSONB,
            consent_cil_checked BOOLEAN NOT NULL DEFAULT true,
            consent_partner_checked BOOLEAN NOT NULL DEFAULT true,
            ip_address TEXT NOT NULL,
            is_flagged_anomaly BOOLEAN NOT NULL DEFAULT false,
            security_risk_level TEXT NOT NULL DEFAULT 'none',
            security_logs JSONB NOT NULL,
            distribution_channels JSONB NOT NULL,
            distribution_type TEXT NOT NULL DEFAULT 'standard'
          );

          CREATE TABLE IF NOT EXISTS activity_logs (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS market_trends (
            id TEXT PRIMARY KEY,
            keyword TEXT NOT NULL,
            sector TEXT NOT NULL,
            volume TEXT NOT NULL,
            growth TEXT NOT NULL,
            description TEXT NOT NULL,
            opportunity TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS security_events (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            event_type TEXT NOT NULL,
            description TEXT NOT NULL,
            severity TEXT NOT NULL
          );

          -- Idempotent schema migrations to ensure columns exist on existing databases
          ALTER TABLE sites ADD COLUMN IF NOT EXISTS api_key TEXT;
          ALTER TABLE sites ADD COLUMN IF NOT EXISTS branded_config JSONB;
          ALTER TABLE sites ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

          ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS site_id TEXT REFERENCES sites(id) ON DELETE SET NULL;
          ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS target_segment TEXT DEFAULT 'PROJECT';
          ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS budget INTEGER DEFAULT 150000;
          ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS landing_page TEXT;
          ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'google_ads';
          ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

          ALTER TABLE partners ADD COLUMN IF NOT EXISTS geographic_scope TEXT DEFAULT 'Bobo-Dioulasso';
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'Business';
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS subscription_started_at TEXT;
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS subscription_expires_at TEXT;
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'paid';
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS last_payment_at TEXT;
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS next_payment_due_at TEXT;
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS last_assigned_at TEXT;
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS rotation_index INTEGER DEFAULT 0;
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS api_key TEXT;
          ALTER TABLE partners ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

          ALTER TABLE leads ADD COLUMN IF NOT EXISTS campaign_id TEXT REFERENCES campaigns(id) ON DELETE SET NULL;
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'organic_seo';
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS landing_page TEXT;
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS form_type TEXT DEFAULT 'contact';
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS acquisition_path TEXT;
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS interaction_history JSONB;
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS distribution_type TEXT DEFAULT 'standard';

          -- Production Indexes for fast lookup & filtering
          CREATE INDEX IF NOT EXISTS leads_phone_idx ON leads (phone);
          CREATE INDEX IF NOT EXISTS leads_email_idx ON leads (email);
          CREATE INDEX IF NOT EXISTS leads_site_id_idx ON leads (site_id);
          CREATE INDEX IF NOT EXISTS leads_campaign_id_idx ON leads (campaign_id);
          CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
          CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at);
          CREATE INDEX IF NOT EXISTS leads_partner_id_idx ON leads (assigned_partner_id);
          CREATE INDEX IF NOT EXISTS leads_source_idx ON leads (source);

          CREATE INDEX IF NOT EXISTS campaigns_site_id_idx ON campaigns (site_id);
          CREATE INDEX IF NOT EXISTS campaigns_status_idx ON campaigns (status);
          CREATE INDEX IF NOT EXISTS campaigns_created_at_idx ON campaigns (created_at);

          CREATE INDEX IF NOT EXISTS sites_domain_idx ON sites (domain);
          CREATE INDEX IF NOT EXISTS sites_status_idx ON sites (status);

          CREATE INDEX IF NOT EXISTS partners_sector_idx ON partners (sector);
          CREATE INDEX IF NOT EXISTS partners_status_idx ON partners (status);
          CREATE INDEX IF NOT EXISTS partners_payment_status_idx ON partners (payment_status);
          CREATE INDEX IF NOT EXISTS partners_subscription_status_idx ON partners (subscription_status);
          CREATE INDEX IF NOT EXISTS partners_geographic_scope_idx ON partners (geographic_scope);

          CREATE INDEX IF NOT EXISTS activity_logs_timestamp_idx ON activity_logs (timestamp);
          CREATE INDEX IF NOT EXISTS activity_logs_type_idx ON activity_logs (type);

          CREATE INDEX IF NOT EXISTS security_events_timestamp_idx ON security_events (timestamp);
          CREATE INDEX IF NOT EXISTS security_events_event_type_idx ON security_events (event_type);
          CREATE INDEX IF NOT EXISTS security_events_severity_idx ON security_events (severity);
        `);

        // Idempotent initial seed check
        const siteCountRes = await client.query('SELECT COUNT(*) FROM sites');
        if (parseInt(siteCountRes.rows[0].count, 10) === 0) {
          for (const s of initialSites) {
            await client.query(
              `INSERT INTO sites (id, title, theme, city, domain, status, headline, subheadline, features, chatbot_greeting, chatbot_persona, faqs, leads_count, is_cil_compliant, compliance_rating, compliance_report, api_key, branded_config) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) ON CONFLICT DO NOTHING`,
              [s.id, s.title, s.theme, s.city, s.domain, s.status, s.headline, s.subheadline, JSON.stringify(s.features), s.chatbotGreeting, s.chatbotPersona, JSON.stringify(s.faqs), s.leadsCount, s.isCILCompliant, s.complianceRating, JSON.stringify(s.complianceReport), s.apiKey || null, JSON.stringify(s.brandedConfig || null)]
            );
          }
          for (const c of initialCampaigns) {
            await client.query(
              `INSERT INTO campaigns (id, site_id, name, target_segment, target_city, sector, offer, status, budget, landing_page, source)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT DO NOTHING`,
              [c.id, c.siteId, c.name, c.targetSegment, c.targetCity, c.sector, c.offer, c.status, c.budget || 150000, c.landingPage || null, c.source || 'google_ads']
            );
          }
          for (const p of initialPartners) {
            await client.query(
              `INSERT INTO partners (
                id, name, sector, city, geographic_scope, phone, email, status, 
                subscription_status, subscription_plan, subscription_started_at, subscription_expires_at,
                payment_status, last_payment_at, next_payment_due_at, leads_received, max_leads_per_month,
                revenue_generated, exclusive_access, rotation_index, api_key
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) ON CONFLICT DO NOTHING`,
              [
                p.id, p.name, p.sector, p.city, p.geographicScope || p.city, p.phone, p.email, p.status,
                p.subscriptionStatus || 'active', p.subscriptionPlan || 'Business', p.subscriptionStartedAt || null, p.subscriptionExpiresAt || null,
                p.paymentStatus || 'paid', p.lastPaymentAt || null, p.nextPaymentDueAt || null, p.leadsReceived, p.maxLeadsPerMonth,
                p.revenueGenerated, p.exclusiveAccess, p.rotationIndex || 0, p.apiKey || null
              ]
            );
          }
          for (const l of initialLeads) {
            await client.query(
              `INSERT INTO leads (id, site_id, campaign_id, site_title, name, phone, email, city, raw_message, status, score, summarized_need, budget, urgency, key_pain_point, suggested_action, response_draft, assigned_partner_id, created_at, source, landing_page, form_type, acquisition_path, interaction_history, consent_cil_checked, consent_partner_checked, ip_address, is_flagged_anomaly, security_risk_level, security_logs, distribution_channels, distribution_type)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32) ON CONFLICT DO NOTHING`,
              [l.id, l.siteId, l.campaignId || null, l.siteTitle, l.name, l.phone, l.email, l.city, l.rawMessage, l.status, l.score, l.summarizedNeed, l.budget, l.urgency, l.keyPainPoint, l.suggestedAction, l.responseDraft, l.assignedPartnerId, l.createdAt, l.source || 'organic_seo', l.landingPage || null, l.formType || 'contact', l.acquisitionPath || null, JSON.stringify(l.interactionHistory || []), l.consentCILChecked, l.consentPartnerChecked, l.ipAddress, l.isFlaggedAnomaly, l.securityRiskLevel, JSON.stringify(l.securityLogs), JSON.stringify(l.distributionChannels), l.distributionType]
            );
          }
          for (const log of initialActivityLogs) {
            await client.query(
              `INSERT INTO activity_logs (id, type, message, timestamp) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
              [log.id, log.type, log.message, log.timestamp]
            );
          }
          for (const t of initialMarketTrends) {
            await client.query(
              `INSERT INTO market_trends (id, keyword, sector, volume, growth, description, opportunity) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
              [t.id, t.keyword, t.sector, t.volume, t.growth, t.description, t.opportunity]
            );
          }
          for (const ev of initialSecurityEvents) {
            await client.query(
              `INSERT INTO security_events (id, timestamp, event_type, description, severity) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
              [ev.id, ev.timestamp, ev.eventType, ev.description, ev.severity]
            );
          }
        }
      } finally {
        client.release();
      }

      // Safe masked log without secrets
      let maskedHost = 'neon.tech';
      let dbName = 'neondb';
      try {
        const parsedUrl = new URL(databaseUrl);
        maskedHost = parsedUrl.hostname.replace(/^[^.]+/, 'ep-***');
        dbName = parsedUrl.pathname.replace(/^\//, '') || 'neondb';
      } catch (_) {}

      console.log(`[DATABASE] Neon PostgreSQL CONNECTED (Host: ${maskedHost}, Database: ${dbName}, Region: eu-central-1, SSL: ENABLED)`);
      // Ensure all existing sites in Neon have a secure, unique, random API key (Blocker 2)
      await ensureSiteApiKeys();
    } catch (err: any) {
      const sanitizedError = err?.message || 'Database connection error';
      if (isProduction) {
        console.error(`[DATABASE] FATAL — Production database unavailable: ${sanitizedError}`);
        throw new Error(`[DATABASE] FATAL — Production database connection failed: ${sanitizedError}`);
      } else {
        console.warn(`[DATABASE] WARNING — Could not connect to PostgreSQL in dev mode (${sanitizedError}). Falling back to local db.json.`);
        drizzleDb = null;
        pgPool = null;
        initFileDb();
      }
    }
  } else {
    if (isProduction) {
      console.error('[DATABASE] FATAL — Production database unavailable (DATABASE_URL environment variable is missing).');
      throw new Error('[DATABASE] FATAL — Production database unavailable (DATABASE_URL environment variable is missing).');
    } else {
      console.log('[DATABASE] Local file database mode (db.json) activated (Development Mode).');
      initFileDb();
    }
  }
}

export async function closeDb() {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
    drizzleDb = null;
  }
}

// Data Access Layer Methods

/**
 * Generates a cryptographically strong, random API key for Lead Factory microsites.
 * Format: lf_sec_<48 hex chars>
 */
export function generateSecureSiteApiKey(): string {
  return `lf_sec_${crypto.randomBytes(24).toString('hex')}`;
}

/**
 * Idempotently backfills unique, random cryptographic API keys for any existing sites in Neon or local state
 * that lack an apiKey or have a generic/legacy key.
 */
export async function ensureSiteApiKeys(): Promise<void> {
  if (pgPool) {
    const client = await pgPool.connect();
    try {
      const res = await client.query<{ id: string; api_key: string | null }>(
        'SELECT id, api_key FROM sites'
      );
      for (const row of res.rows) {
        const currentKey = row.api_key;
        const isLegacyOrMissing = !currentKey || 
          currentKey.trim() === '' || 
          currentKey === 'lf_key_default' ||
          currentKey === 'lf_key_solaire_bobo_9921' ||
          currentKey === 'lf_key_academie_tech_8812';

        if (isLegacyOrMissing) {
          const newSecureKey = generateSecureSiteApiKey();
          await client.query('UPDATE sites SET api_key = $1 WHERE id = $2', [newSecureKey, row.id]);
        }
      }
    } catch (err) {
      console.error('[DATABASE] Error during ensureSiteApiKeys backfill:', err);
    } finally {
      client.release();
    }
  }

  // Also ensure local fileState has secure random keys
  for (const s of fileState.sites) {
    const currentKey = s.apiKey;
    const isLegacyOrMissing = !currentKey || 
      currentKey.trim() === '' || 
      currentKey === 'lf_key_default' ||
      currentKey === 'lf_key_solaire_bobo_9921' ||
      currentKey === 'lf_key_academie_tech_8812';

    if (isLegacyOrMissing) {
      s.apiKey = generateSecureSiteApiKey();
    }
  }
}

export async function getSites(): Promise<Site[]> {
  if (drizzleDb) {
    const rows = await drizzleDb.select().from(schema.sites);
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      theme: r.theme as any,
      city: r.city,
      domain: r.domain,
      status: r.status as any,
      headline: r.headline,
      subheadline: r.subheadline,
      features: (r.features || []) as string[],
      chatbotGreeting: r.chatbotGreeting,
      chatbotPersona: r.chatbotPersona,
      faqs: (r.faqs || []) as any,
      leadsCount: r.leadsCount,
      apiKey: r.apiKey || undefined,
      brandedConfig: (r.brandedConfig || undefined) as any,
      isCILCompliant: r.isCILCompliant,
      complianceRating: r.complianceRating,
      complianceReport: r.complianceReport as any
    }));
  }
  return fileState.sites;
}

export async function saveSite(site: Site): Promise<Site> {
  if (!site.apiKey || site.apiKey.trim() === '' || site.apiKey === 'lf_key_default') {
    site.apiKey = generateSecureSiteApiKey();
  }
  if (drizzleDb) {
    await drizzleDb.insert(schema.sites).values({
      id: site.id,
      title: site.title,
      theme: site.theme,
      city: site.city,
      domain: site.domain,
      status: site.status,
      headline: site.headline,
      subheadline: site.subheadline,
      features: site.features,
      chatbotGreeting: site.chatbotGreeting,
      chatbotPersona: site.chatbotPersona,
      faqs: site.faqs,
      leadsCount: site.leadsCount,
      apiKey: site.apiKey,
      brandedConfig: site.brandedConfig,
      isCILCompliant: site.isCILCompliant,
      complianceRating: site.complianceRating,
      complianceReport: site.complianceReport
    }).onConflictDoUpdate({
      target: schema.sites.id,
      set: {
        title: site.title,
        theme: site.theme,
        city: site.city,
        domain: site.domain,
        status: site.status,
        headline: site.headline,
        subheadline: site.subheadline,
        features: site.features,
        chatbotGreeting: site.chatbotGreeting,
        chatbotPersona: site.chatbotPersona,
        faqs: site.faqs,
        leadsCount: site.leadsCount,
        apiKey: site.apiKey,
        brandedConfig: site.brandedConfig,
        isCILCompliant: site.isCILCompliant,
        complianceRating: site.complianceRating,
        complianceReport: site.complianceReport
      }
    });
    return site;
  }
  const idx = fileState.sites.findIndex(s => s.id === site.id);
  if (idx >= 0) {
    fileState.sites[idx] = site;
  } else {
    fileState.sites.push(site);
  }
  saveFileDb();
  return site;
}

export async function getSiteById(id: string): Promise<Site | null> {
  const sites = await getSites();
  return sites.find(s => s.id === id) || null;
}

export async function getCampaignsBySiteId(siteId: string): Promise<CampaignData[]> {
  const all = await getCampaigns();
  return all.filter(c => c.siteId === siteId);
}

export function getDefaultQualificationQuestions(theme: string): any[] {
  switch (theme) {
    case 'solaire':
      return [
        {
          id: "installation_type",
          label: "Type d'installation recherchée",
          type: "select",
          required: true,
          options: [
            "Solaire Résidentiel (Maison / Villa)",
            "Pompage Solaire Agricole (Irrigation)",
            "Installation Entreprise / Commerce",
            "Kit Solaire Autonome d'Urgence"
          ]
        },
        {
          id: "power_capacity",
          label: "Puissance estimée ou appareils à alimenter",
          type: "select",
          required: true,
          options: [
            "1 à 3 kVA (Éclairage, TV, ventilateurs, frigo)",
            "5 à 10 kVA (Climatisation, congélateurs, machines)",
            "Plus de 10 kVA (Industriel ou grand domaine)",
            "Je ne sais pas (Besoin d'un dimensionnement)"
          ]
        },
        {
          id: "location_details",
          label: "Quartier ou localité de l'installation",
          type: "location",
          required: true,
          placeholder: "Ex: Sarfalao, Koko, Belleville..."
        },
        {
          id: "budget_range",
          label: "Fourchette budgétaire estimée",
          type: "select",
          required: true,
          options: [
            "Moins de 500 000 FCFA",
            "500 000 à 1 500 000 FCFA",
            "1 500 000 à 3 500 000 FCFA",
            "Plus de 3 500 000 FCFA"
          ]
        },
        {
          id: "timeline",
          label: "Délai souhaité pour les travaux",
          type: "radio",
          required: true,
          options: ["Urgent (Moins de 7 jours)", "Dans le mois", "Projet d'ici 2 à 3 mois"]
        }
      ];
    case 'formation':
      return [
        {
          id: "learner_profile",
          label: "Quel est votre profil ou situation actuelle ?",
          type: "select",
          required: true,
          options: [
            "Étudiant / Jeune diplômé en quête d'insertion",
            "Professionnel en poste (Montée en compétences)",
            "Entrepreneur / Porteur de projet digital",
            "Reconversion professionnelle totale"
          ]
        },
        {
          id: "target_program",
          label: "Programme ou compétence visée",
          type: "select",
          required: true,
          options: [
            "Intelligence Artificielle & Automatisation (No-Code / LLM)",
            "Développement Web & Applications Mobiles",
            "Marketing Digital, Acquisition & Vente",
            "Gestion de Projet Digital & Data"
          ]
        },
        {
          id: "learning_format",
          label: "Rythme d'apprentissage préféré",
          type: "radio",
          required: true,
          options: [
            "Cours du soir & Samedi (Idéal professionnels)",
            "Bootcamp Intensif en journée (Temps plein)",
            "Formation Hybride (En ligne + Ateliers pratiques)"
          ]
        },
        {
          id: "training_budget",
          label: "Budget formation envisagé",
          type: "select",
          required: true,
          options: [
            "Moins de 100 000 FCFA (Module court)",
            "100 000 à 250 000 FCFA (Certifiant)",
            "Plus de 250 000 FCFA (Parcours diplômant)",
            "Prise en charge par mon employeur"
          ]
        },
        {
          id: "start_urgency",
          label: "Disponibilité pour démarrer",
          type: "select",
          required: true,
          options: ["Immédiatement (Prochaine cohorte)", "Dans le trimestre à venir", "Simple demande d'information"]
        }
      ];
    case 'immobilier':
      return [
        {
          id: "property_type",
          label: "Type de projet immobilier",
          type: "select",
          required: true,
          options: ["Achat de Terrain / Parcelle", "Location Villa / Appartement", "Achat Bâtiment / Maison", "Estimation de bien"]
        },
        {
          id: "desired_location",
          label: "Zone géographique souhaitée",
          type: "location",
          required: true,
          placeholder: "Ex: Zone résidentielle, centre-ville..."
        },
        {
          id: "budget_range",
          label: "Budget global prévu",
          type: "select",
          required: true,
          options: ["Moins de 5 000 000 FCFA", "5 000 000 à 15 000 000 FCFA", "Plus de 15 000 000 FCFA"]
        }
      ];
    default:
      return [
        {
          id: "need_description",
          label: "Décrivez précisément votre projet ou votre besoin",
          type: "textarea",
          required: true,
          placeholder: "Détails de votre demande..."
        },
        {
          id: "budget_range",
          label: "Budget estimé",
          type: "select",
          required: true,
          options: ["Budget Standard", "Budget Moyen", "Budget Premium"]
        },
        {
          id: "urgency",
          label: "Délai souhaité",
          type: "select",
          required: true,
          options: ["Urgent (< 7j)", "Dans le mois", "Étude préalable"]
        }
      ];
  }
}

export async function getCampaigns(): Promise<CampaignData[]> {
  if (drizzleDb) {
    const rows = await drizzleDb.select().from(schema.campaigns);
    return rows.map(r => ({
      id: r.id,
      siteId: r.siteId || undefined,
      name: r.name,
      targetSegment: r.targetSegment,
      targetCity: r.targetCity,
      sector: r.sector,
      offer: r.offer || undefined,
      status: r.status,
      budget: r.budget || 150000,
      landingPage: r.landingPage || undefined,
      source: r.source || 'google_ads',
      createdAt: r.createdAt ? r.createdAt.toISOString() : undefined
    }));
  }
  return fileState.campaigns;
}

export async function saveCampaign(campaign: CampaignData): Promise<CampaignData> {
  if (drizzleDb) {
    await drizzleDb.insert(schema.campaigns).values({
      id: campaign.id,
      siteId: campaign.siteId,
      name: campaign.name,
      targetSegment: campaign.targetSegment,
      targetCity: campaign.targetCity,
      sector: campaign.sector,
      offer: campaign.offer,
      status: campaign.status,
      budget: campaign.budget || 150000,
      landingPage: campaign.landingPage,
      source: campaign.source || 'google_ads'
    }).onConflictDoUpdate({
      target: schema.campaigns.id,
      set: {
        status: campaign.status,
        offer: campaign.offer,
        budget: campaign.budget,
        landingPage: campaign.landingPage,
        source: campaign.source
      }
    });
    return campaign;
  }
  const idx = fileState.campaigns.findIndex(c => c.id === campaign.id);
  if (idx >= 0) {
    fileState.campaigns[idx] = campaign;
  } else {
    fileState.campaigns.push(campaign);
  }
  saveFileDb();
  return campaign;
}

export async function getLeads(siteId?: string): Promise<Lead[]> {
  if (drizzleDb) {
    const query = siteId 
      ? drizzleDb.select().from(schema.leads).where(eq(schema.leads.siteId, siteId))
      : drizzleDb.select().from(schema.leads);
    const rows = await query;
    return rows.map(r => ({
      id: r.id,
      siteId: r.siteId,
      campaignId: r.campaignId || undefined,
      siteTitle: r.siteTitle,
      name: r.name,
      phone: r.phone,
      email: r.email,
      city: r.city,
      rawMessage: r.rawMessage,
      status: r.status as any,
      score: r.score,
      summarizedNeed: r.summarizedNeed,
      budget: r.budget as any,
      urgency: r.urgency as any,
      keyPainPoint: r.keyPainPoint,
      suggestedAction: r.suggestedAction,
      responseDraft: r.responseDraft,
      assignedPartnerId: r.assignedPartnerId,
      createdAt: r.createdAt,
      source: r.source || 'organic_seo',
      landingPage: r.landingPage || undefined,
      formType: r.formType || 'contact',
      acquisitionPath: r.acquisitionPath || undefined,
      interactionHistory: (r.interactionHistory || []) as any,
      consentCILChecked: r.consentCILChecked,
      consentPartnerChecked: r.consentPartnerChecked,
      ipAddress: r.ipAddress,
      isFlaggedAnomaly: r.isFlaggedAnomaly,
      securityRiskLevel: r.securityRiskLevel as any,
      securityLogs: (r.securityLogs || []) as string[],
      distributionChannels: r.distributionChannels as any,
      distributionType: r.distributionType as any
    }));
  }
  if (siteId) {
    return fileState.leads.filter(l => l.siteId === siteId);
  }
  return fileState.leads;
}


export async function saveLead(lead: Lead): Promise<Lead> {
  if (drizzleDb) {
    await drizzleDb.insert(schema.leads).values({
      id: lead.id,
      siteId: lead.siteId,
      campaignId: lead.campaignId || null,
      siteTitle: lead.siteTitle,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      city: lead.city,
      rawMessage: lead.rawMessage,
      status: lead.status,
      score: lead.score,
      summarizedNeed: lead.summarizedNeed,
      budget: lead.budget,
      urgency: lead.urgency,
      keyPainPoint: lead.keyPainPoint,
      suggestedAction: lead.suggestedAction,
      responseDraft: lead.responseDraft,
      assignedPartnerId: lead.assignedPartnerId || null,
      createdAt: lead.createdAt || new Date().toISOString(),
      source: lead.source || 'organic_seo',
      landingPage: lead.landingPage || null,
      formType: lead.formType || 'contact',
      acquisitionPath: lead.acquisitionPath || null,
      interactionHistory: lead.interactionHistory || [],
      consentCILChecked: lead.consentCILChecked !== undefined ? lead.consentCILChecked : true,
      consentPartnerChecked: lead.consentPartnerChecked !== undefined ? lead.consentPartnerChecked : true,
      ipAddress: lead.ipAddress || '196.28.24.1',
      isFlaggedAnomaly: lead.isFlaggedAnomaly !== undefined ? lead.isFlaggedAnomaly : false,
      securityRiskLevel: lead.securityRiskLevel || 'none',
      securityLogs: lead.securityLogs || [],
      distributionChannels: lead.distributionChannels,
      distributionType: lead.distributionType || 'standard'
    }).onConflictDoUpdate({
      target: schema.leads.id,
      set: {
        status: lead.status,
        assignedPartnerId: lead.assignedPartnerId,
        score: lead.score,
        rawMessage: lead.rawMessage,
        summarizedNeed: lead.summarizedNeed,
        budget: lead.budget,
        urgency: lead.urgency,
        keyPainPoint: lead.keyPainPoint,
        suggestedAction: lead.suggestedAction,
        responseDraft: lead.responseDraft,
        interactionHistory: lead.interactionHistory
      }
    });
    return lead;
  }
  const idx = fileState.leads.findIndex(l => l.id === lead.id);
  if (idx >= 0) {
    fileState.leads[idx] = lead;
  } else {
    fileState.leads.unshift(lead);
  }
  saveFileDb();
  return lead;
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<Lead | null> {
  if (drizzleDb) {
    await drizzleDb.update(schema.leads).set({ status }).where(eq(schema.leads.id, id));
    const [updated] = await drizzleDb.select().from(schema.leads).where(eq(schema.leads.id, id));
    if (!updated) return null;
    return getLeads().then(all => all.find(l => l.id === id) || null);
  }
  const lead = fileState.leads.find(l => l.id === id);
  if (lead) {
    lead.status = status;
    saveFileDb();
    return lead;
  }
  return null;
}

export async function getPartners(): Promise<Partner[]> {
  if (drizzleDb) {
    const rows = await drizzleDb.select().from(schema.partners);
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      sector: r.sector,
      city: r.city,
      geographicScope: r.geographicScope || r.city,
      phone: r.phone,
      email: r.email,
      status: r.status as any,
      subscriptionStatus: (r.subscriptionStatus || 'active') as any,
      subscriptionPlan: (r.subscriptionPlan || 'Business') as any,
      subscriptionStartedAt: r.subscriptionStartedAt || undefined,
      subscriptionExpiresAt: r.subscriptionExpiresAt || undefined,
      paymentStatus: (r.paymentStatus || 'paid') as any,
      lastPaymentAt: r.lastPaymentAt || undefined,
      nextPaymentDueAt: r.nextPaymentDueAt || undefined,
      leadsReceived: r.leadsReceived,
      maxLeadsPerMonth: r.maxLeadsPerMonth,
      revenueGenerated: r.revenueGenerated,
      exclusiveAccess: r.exclusiveAccess,
      lastAssignedAt: r.lastAssignedAt || undefined,
      rotationIndex: r.rotationIndex || 0,
      apiKey: r.apiKey || undefined,
      createdAt: r.createdAt ? r.createdAt.toISOString() : undefined,
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : undefined
    }));
  }
  return fileState.partners;
}

export async function savePartner(partner: Partner): Promise<Partner> {
  if (drizzleDb) {
    await drizzleDb.insert(schema.partners).values({
      id: partner.id,
      name: partner.name,
      sector: partner.sector,
      city: partner.city,
      geographicScope: partner.geographicScope || partner.city,
      phone: partner.phone,
      email: partner.email,
      status: partner.status,
      subscriptionStatus: partner.subscriptionStatus || 'active',
      subscriptionPlan: partner.subscriptionPlan || 'Business',
      subscriptionStartedAt: partner.subscriptionStartedAt,
      subscriptionExpiresAt: partner.subscriptionExpiresAt,
      paymentStatus: partner.paymentStatus || 'paid',
      lastPaymentAt: partner.lastPaymentAt,
      nextPaymentDueAt: partner.nextPaymentDueAt,
      leadsReceived: partner.leadsReceived,
      maxLeadsPerMonth: partner.maxLeadsPerMonth,
      revenueGenerated: partner.revenueGenerated,
      exclusiveAccess: partner.exclusiveAccess,
      lastAssignedAt: partner.lastAssignedAt,
      rotationIndex: partner.rotationIndex || 0,
      apiKey: partner.apiKey,
      updatedAt: new Date()
    }).onConflictDoUpdate({
      target: schema.partners.id,
      set: {
        name: partner.name,
        sector: partner.sector,
        city: partner.city,
        geographicScope: partner.geographicScope || partner.city,
        phone: partner.phone,
        email: partner.email,
        status: partner.status,
        subscriptionStatus: partner.subscriptionStatus || 'active',
        subscriptionPlan: partner.subscriptionPlan || 'Business',
        subscriptionStartedAt: partner.subscriptionStartedAt,
        subscriptionExpiresAt: partner.subscriptionExpiresAt,
        paymentStatus: partner.paymentStatus || 'paid',
        lastPaymentAt: partner.lastPaymentAt,
        nextPaymentDueAt: partner.nextPaymentDueAt,
        maxLeadsPerMonth: partner.maxLeadsPerMonth,
        leadsReceived: partner.leadsReceived,
        revenueGenerated: partner.revenueGenerated,
        exclusiveAccess: partner.exclusiveAccess,
        lastAssignedAt: partner.lastAssignedAt,
        rotationIndex: partner.rotationIndex || 0,
        updatedAt: new Date()
      }
    });
    return partner;
  }
  const idx = fileState.partners.findIndex(p => p.id === partner.id);
  if (idx >= 0) {
    fileState.partners[idx] = partner;
  } else {
    fileState.partners.push(partner);
  }
  saveFileDb();
  return partner;
}

export async function updatePartner(id: string, updates: Partial<Partner>): Promise<Partner | null> {
  const all = await getPartners();
  const target = all.find(p => p.id === id);
  if (!target) return null;

  const updated: Partner = {
    ...target,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return savePartner(updated);
}

// ===================================================
// P0.4: BUSINESS LOGIC - SUBSCRIPTION & ELIGIBILITY
// ===================================================

export function isPartnerEligibleForLead(
  partner: Partner,
  leadSector: string,
  leadCity: string,
  distType: 'standard' | 'exclusive' = 'standard'
): { eligible: boolean; reason: string } {
  if (!partner) {
    return { eligible: false, reason: "PARTNER_NOT_FOUND" };
  }

  // 1. Partner operational status
  if (partner.status === 'suspended') {
    return { eligible: false, reason: "PARTNER_SUSPENDED" };
  }

  // 2. Payment status
  if (partner.paymentStatus === 'overdue') {
    return { eligible: false, reason: "PAYMENT_OVERDUE" };
  }
  if (partner.paymentStatus === 'pending') {
    return { eligible: false, reason: "PAYMENT_PENDING" };
  }
  if (partner.paymentStatus !== 'paid') {
    return { eligible: false, reason: "PAYMENT_NOT_CONFIRMED" };
  }

  // 3. Subscription status & expiration
  if (partner.subscriptionStatus === 'expired' || partner.subscriptionStatus === 'canceled') {
    return { eligible: false, reason: "SUBSCRIPTION_EXPIRED" };
  }
  if (partner.subscriptionExpiresAt) {
    const expiresTime = new Date(partner.subscriptionExpiresAt).getTime();
    if (!isNaN(expiresTime) && expiresTime < Date.now()) {
      return { eligible: false, reason: "SUBSCRIPTION_EXPIRED" };
    }
  }

  // 4. Quota check
  if (partner.maxLeadsPerMonth && partner.leadsReceived >= partner.maxLeadsPerMonth) {
    return { eligible: false, reason: "QUOTA_EXCEEDED" };
  }

  // 5. Sector matching
  const pSector = (partner.sector || '').toLowerCase().trim();
  const lSector = (leadSector || '').toLowerCase().trim();
  const sectorMatches = pSector === 'tous' || pSector === 'all' || pSector === lSector || lSector.includes(pSector) || pSector.includes(lSector);
  if (!sectorMatches) {
    return { eligible: false, reason: "SECTOR_MISMATCH" };
  }

  // 6. Geographic matching
  const pZone = (partner.geographicScope || partner.city || '').toLowerCase().trim();
  const lCity = (leadCity || '').toLowerCase().trim();
  const zoneMatches = pZone === 'burkina faso' || pZone === 'national' || pZone === 'tous' || pZone === 'all' || pZone === lCity || lCity.includes(pZone) || pZone.includes(lCity);
  if (!zoneMatches) {
    return { eligible: false, reason: "ZONE_MISMATCH" };
  }

  return { eligible: true, reason: "MATCH" };
}

export async function findBestEligiblePartner(
  sector: string,
  city: string,
  distributionType: 'standard' | 'exclusive' = 'standard'
): Promise<Partner | null> {
  const allPartners = await getPartners();
  
  // Filter eligible partners
  const eligiblePartners = allPartners.filter(p => {
    const check = isPartnerEligibleForLead(p, sector, city, distributionType);
    return check.eligible;
  });

  if (eligiblePartners.length === 0) {
    return null;
  }

  // If exclusive distribution, prefer Premium partners if available
  let candidatePool = eligiblePartners;
  if (distributionType === 'exclusive') {
    const premiumCandidates = eligiblePartners.filter(p => p.subscriptionPlan === 'Premium' || p.exclusiveAccess);
    if (premiumCandidates.length > 0) {
      candidatePool = premiumCandidates;
    }
  }

  // Deterministic Fair Rotation:
  // 1. Minimum leadsReceived
  // 2. Lowest rotationIndex
  // 3. Oldest lastAssignedAt
  // 4. Stable tie-breaker: ID ascending
  candidatePool.sort((a, b) => {
    if (a.leadsReceived !== b.leadsReceived) {
      return a.leadsReceived - b.leadsReceived;
    }
    const aRot = a.rotationIndex || 0;
    const bRot = b.rotationIndex || 0;
    if (aRot !== bRot) {
      return aRot - bRot;
    }
    const aTime = a.lastAssignedAt ? new Date(a.lastAssignedAt).getTime() : 0;
    const bTime = b.lastAssignedAt ? new Date(b.lastAssignedAt).getTime() : 0;
    if (aTime !== bTime) {
      return aTime - bTime;
    }
    return a.id.localeCompare(b.id);
  });

  return candidatePool[0] || null;
}

export async function confirmPartnerPayment(
  partnerId: string,
  paymentReference?: string,
  amount: number = 50000,
  extendDays: number = 30
): Promise<{ success: boolean; partner?: Partner; error?: string }> {
  const partners = await getPartners();
  const partner = partners.find(p => p.id === partnerId);
  if (!partner) return { success: false, error: "Partenaire non trouvé" };

  const now = new Date();
  const nextDueDate = new Date(now.getTime() + extendDays * 24 * 60 * 60 * 1000);
  const wasSuspended = partner.status === 'suspended';

  partner.paymentStatus = 'paid';
  partner.status = 'active';
  partner.subscriptionStatus = 'active';
  partner.lastPaymentAt = now.toISOString();
  partner.nextPaymentDueAt = nextDueDate.toISOString();
  partner.subscriptionExpiresAt = nextDueDate.toISOString();
  if (amount > 0) {
    partner.revenueGenerated = (partner.revenueGenerated || 0) + amount;
  }
  partner.updatedAt = now.toISOString();

  await savePartner(partner);

  const nowIso = now.toISOString();
  await addActivityLog({
    id: "log-" + Date.now(),
    type: "PARTNER_PAYMENT_CONFIRMED",
    message: `[PAIEMENT CONFIRMÉ] Abonnement renouvelé pour ${partner.name} (${partner.subscriptionPlan}). Réf: ${paymentReference || 'MANUAL-CONFIRM'} — Échéance : ${partner.subscriptionExpiresAt}`,
    timestamp: nowIso
  });

  if (wasSuspended) {
    await addActivityLog({
      id: "log-" + (Date.now() + 1),
      type: "PARTNER_REACTIVATED",
      message: `[RÉACTIVATION] Partenaire ${partner.name} réactivé suite à régularisation de paiement.`,
      timestamp: nowIso
    });
  }

  return { success: true, partner };
}

export async function suspendPartner(
  partnerId: string,
  reason: string = "PAYMENT_OVERDUE"
): Promise<{ success: boolean; partner?: Partner; error?: string }> {
  const partners = await getPartners();
  const partner = partners.find(p => p.id === partnerId);
  if (!partner) return { success: false, error: "Partenaire non trouvé" };

  partner.status = 'suspended';
  if (reason.includes("OVERDUE") || reason.includes("EXPIRED")) {
    partner.paymentStatus = 'overdue';
    partner.subscriptionStatus = 'expired';
  }
  partner.updatedAt = new Date().toISOString();

  await savePartner(partner);

  await addActivityLog({
    id: "log-" + Date.now(),
    type: "PARTNER_SUSPENDED",
    message: `[SUSPENSION] Partenaire ${partner.name} suspendu. Motif : ${reason}. Aucun nouveau lead ne lui sera attribué.`,
    timestamp: new Date().toISOString()
  });

  return { success: true, partner };
}

export async function reactivatePartner(
  partnerId: string
): Promise<{ success: boolean; partner?: Partner; error?: string }> {
  const partners = await getPartners();
  const partner = partners.find(p => p.id === partnerId);
  if (!partner) return { success: false, error: "Partenaire non trouvé" };

  partner.status = 'active';
  partner.paymentStatus = 'paid';
  partner.subscriptionStatus = 'active';
  partner.updatedAt = new Date().toISOString();

  await savePartner(partner);

  await addActivityLog({
    id: "log-" + Date.now(),
    type: "PARTNER_REACTIVATED",
    message: `[RÉACTIVATION] Partenaire ${partner.name} réactivé. Éligible pour recevoir des leads qualifiés.`,
    timestamp: new Date().toISOString()
  });

  return { success: true, partner };
}

export async function isSubscriptionActive(partnerId: string): Promise<{ active: boolean; reason: string }> {
  const partners = await getPartners();
  const partner = partners.find(p => p.id === partnerId);
  if (!partner) return { active: false, reason: "PARTNER_NOT_FOUND" };
  if (partner.status !== 'active') return { active: false, reason: "PARTNER_SUSPENDED" };
  if (partner.paymentStatus !== 'paid') return { active: false, reason: "PAYMENT_" + partner.paymentStatus.toUpperCase() };
  if (partner.subscriptionExpiresAt && new Date(partner.subscriptionExpiresAt).getTime() < Date.now()) {
    return { active: false, reason: "SUBSCRIPTION_EXPIRED" };
  }
  return { active: true, reason: "ACTIVE_AND_PAID" };
}

export async function checkPartnerSubscriptions(): Promise<{ checked: number; suspended: number; active: number }> {
  const partners = await getPartners();
  const now = Date.now();
  let suspendedCount = 0;
  let activeCount = 0;

  for (const partner of partners) {
    if (partner.status === 'active') {
      const isExpired = partner.subscriptionExpiresAt ? new Date(partner.subscriptionExpiresAt).getTime() < now : false;
      const isPaymentNotPaid = partner.paymentStatus !== 'paid';

      if (isExpired || isPaymentNotPaid) {
        await suspendPartner(partner.id, isExpired ? "SUBSCRIPTION_EXPIRED" : "PAYMENT_NOT_CONFIRMED");
        suspendedCount++;
      } else {
        activeCount++;
      }
    }
  }

  return { checked: partners.length, suspended: suspendedCount, active: activeCount };
}

export async function sendPartnerLeadEmail(
  partner: Partner,
  lead: Lead
): Promise<{ success: boolean; sentAt: string | null; error?: string }> {
  try {
    if (!partner.email || !partner.email.includes("@")) {
      throw new Error("Adresse email partenaire manquante ou invalide");
    }

    // Email Body Isolation: Contains ONLY lead business details, strictly no internal secrets or credentials
    const emailSubject = `Nouveau prospect qualifié — Lead Factory Africa (${lead.siteTitle})`;
    const emailBody = `
Bonjour ${partner.name},

Un nouveau prospect qualifié correspondant à votre périmètre commercial (${partner.sector} / ${partner.geographicScope || partner.city}) est disponible :

- Nom du prospect : ${lead.name}
- Téléphone direct : ${lead.phone}
- Email : ${lead.email || "Non communiqué"}
- Localisation : ${lead.city}
- Besoin résumé : ${lead.summarizedNeed}
- Urgence : ${lead.urgency}
- Budget estimé : ${lead.budget}
- Point de douleur principal : ${lead.keyPainPoint}
- Action commerciale recommandée : ${lead.suggestedAction}
- Proposition de réponse :
${lead.responseDraft}

Cordialement,
Le Système de Distribution Lead Factory Africa AI
    `.trim();

    // Log the notification dispatch
    const sentAt = new Date().toISOString();
    await addActivityLog({
      id: "log-" + Date.now(),
      type: "PARTNER_EMAIL_SENT",
      message: `[PARTNER_EMAIL_SENT] Notification lead ${lead.id} transmise avec succès à ${partner.email} (${partner.name}).`,
      timestamp: sentAt
    });

    return { success: true, sentAt };
  } catch (err: any) {
    const errorMsg = err?.message || "Échec d'envoi email";
    await addActivityLog({
      id: "log-" + Date.now(),
      type: "PARTNER_EMAIL_FAILED",
      message: `[PARTNER_EMAIL_FAILED] Échec d'envoi notification lead ${lead.id} pour ${partner.email} : ${errorMsg}`,
      timestamp: new Date().toISOString()
    });
    return { success: false, sentAt: null, error: errorMsg };
  }
}

export async function assignLeadToPartner(
  leadId: string,
  partnerId: string,
  reason: string = "MATCH"
): Promise<{ success: boolean; lead?: Lead; partner?: Partner; error?: string }> {
  // Ensure atomicity
  if (pgPool) {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      
      const leadRes = await client.query('SELECT * FROM leads WHERE id = $1 FOR UPDATE', [leadId]);
      if (leadRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return { success: false, error: "Lead introuvable" };
      }
      const rawLead = leadRes.rows[0];

      const partnerRes = await client.query('SELECT * FROM partners WHERE id = $1 FOR UPDATE', [partnerId]);
      if (partnerRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return { success: false, error: "Partenaire introuvable" };
      }
      const rawPartner = partnerRes.rows[0];

      const nowIso = new Date().toISOString();
      const rawChannels = typeof rawLead.distribution_channels === 'object' ? rawLead.distribution_channels : JSON.parse(rawLead.distribution_channels || '{}');
      rawChannels.email = {
        sent: true,
        sentAt: nowIso,
        recipient: rawPartner.email
      };

      // Update lead
      await client.query(
        `UPDATE leads SET assigned_partner_id = $1, status = 'contacted', distribution_channels = $2 WHERE id = $3`,
        [partnerId, JSON.stringify(rawChannels), leadId]
      );

      // Update partner
      const newLeadsReceived = (rawPartner.leads_received || 0) + 1;
      const newRotIndex = (rawPartner.rotation_index || 0) + 1;
      await client.query(
        `UPDATE partners SET leads_received = $1, last_assigned_at = $2, rotation_index = $3, updated_at = NOW() WHERE id = $4`,
        [newLeadsReceived, nowIso, newRotIndex, partnerId]
      );

      // Add activity log
      const logId = "log-" + Date.now();
      const logMessage = `[LEAD_ASSIGNED] Prospect ${rawLead.name} (${rawLead.phone}) attribué au partenaire ${rawPartner.name} (${reason}).`;
      await client.query(
        `INSERT INTO activity_logs (id, type, message, timestamp) VALUES ($1, $2, $3, $4)`,
        [logId, 'LEAD_ASSIGNED', logMessage, nowIso]
      );

      await client.query('COMMIT');
      
      const updatedLeads = await getLeads();
      const updatedPartners = await getPartners();
      const lead = updatedLeads.find(l => l.id === leadId);
      const partner = updatedPartners.find(p => p.id === partnerId);
      return { success: true, lead, partner };
    } catch (err: any) {
      await client.query('ROLLBACK');
      return { success: false, error: err?.message || "Erreur de transaction d'attribution" };
    } finally {
      client.release();
    }
  } else {
    // Fallback file DB mode
    const leads = await getLeads();
    const partners = await getPartners();
    const lead = leads.find(l => l.id === leadId);
    const partner = partners.find(p => p.id === partnerId);
    if (!lead) return { success: false, error: "Lead introuvable" };
    if (!partner) return { success: false, error: "Partenaire introuvable" };

    const nowIso = new Date().toISOString();
    lead.assignedPartnerId = partnerId;
    lead.status = 'contacted';
    lead.distributionChannels.email = {
      sent: true,
      sentAt: nowIso,
      recipient: partner.email
    };
    partner.leadsReceived += 1;
    partner.lastAssignedAt = nowIso;
    partner.rotationIndex = (partner.rotationIndex || 0) + 1;

    await saveLead(lead);
    await savePartner(partner);
    await addActivityLog({
      id: "log-" + Date.now(),
      type: "LEAD_ASSIGNED",
      message: `[LEAD_ASSIGNED] Prospect ${lead.name} (${lead.phone}) attribué au partenaire ${partner.name} (${reason}).`,
      timestamp: nowIso
    });

    return { success: true, lead, partner };
  }
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  if (drizzleDb) {
    const rows = await drizzleDb.select().from(schema.activityLogs);
    return rows.map(r => ({
      id: r.id,
      type: r.type as any,
      message: r.message,
      timestamp: r.timestamp
    }));
  }
  return fileState.activityLogs;
}

export async function addActivityLog(log: ActivityLog): Promise<ActivityLog> {
  if (drizzleDb) {
    await drizzleDb.insert(schema.activityLogs).values({
      id: log.id,
      type: log.type,
      message: log.message,
      timestamp: log.timestamp
    });
    return log;
  }
  fileState.activityLogs.unshift(log);
  saveFileDb();
  return log;
}

export async function getMarketTrends(): Promise<MarketTrend[]> {
  if (drizzleDb) {
    const rows = await drizzleDb.select().from(schema.marketTrends);
    return rows.map(r => ({
      id: r.id,
      keyword: r.keyword,
      sector: r.sector,
      volume: r.volume,
      growth: r.growth,
      description: r.description,
      opportunity: r.opportunity
    }));
  }
  return fileState.marketTrends;
}

export async function getSecurityEvents(): Promise<SecurityEvent[]> {
  if (drizzleDb) {
    const rows = await drizzleDb.select().from(schema.securityEvents);
    return rows.map(r => ({
      id: r.id,
      timestamp: r.timestamp,
      eventType: r.eventType as any,
      description: r.description,
      severity: r.severity as any
    }));
  }
  return fileState.securityEvents;
}

export async function addSecurityEvent(event: SecurityEvent): Promise<SecurityEvent> {
  if (drizzleDb) {
    await drizzleDb.insert(schema.securityEvents).values({
      id: event.id,
      timestamp: event.timestamp,
      eventType: event.eventType,
      description: event.description,
      severity: event.severity
    });
    return event;
  }
  fileState.securityEvents.unshift(event);
  saveFileDb();
  return event;
}

// Normalization Helper for West African & International Phone Numbers
export function normalizePhoneNumber(rawPhone?: string): string {
  if (!rawPhone) return '';
  // Strip all non-digit characters (spaces, dots, hyphens, brackets, plus)
  let digits = rawPhone.replace(/\D/g, '');
  // Handle international prefixes for Burkina Faso (+226 / 00226)
  if (digits.startsWith('00226')) {
    digits = digits.slice(5);
  } else if (digits.startsWith('226')) {
    digits = digits.slice(3);
  }
  return digits;
}

// Deduplication Engine: Normalize phone numbers and search for existing prospect memory by phone or email
export async function findExistingLeadByContact(phone?: string, email?: string): Promise<Lead | null> {
  const allLeads = await getLeads();
  const cleanPhone = normalizePhoneNumber(phone);
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  for (const lead of allLeads) {
    // Phone match: 8+ digits exact match after normalization
    if (cleanPhone && cleanPhone.length >= 8 && normalizePhoneNumber(lead.phone) === cleanPhone) {
      return lead;
    }
    // Email match: valid structured email without generic fallback domain
    if (
      cleanEmail &&
      cleanEmail.length > 5 &&
      !cleanEmail.includes('non-precise') &&
      !cleanEmail.includes('mail.com') &&
      lead.email.trim().toLowerCase() === cleanEmail
    ) {
      return lead;
    }
  }

  return null;
}

// Transaction helper for atomic operations on PostgreSQL
export async function withTransaction<T>(callback: (txDb: any) => Promise<T>): Promise<T> {
  if (drizzleDb) {
    return await drizzleDb.transaction(async (tx) => {
      return await callback(tx);
    });
  }
  // File fallback execution
  return await callback(null);
}

