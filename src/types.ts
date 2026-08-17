export interface QualificationQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'phone' | 'email' | 'location';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

export interface BrandedFormConfig {
  logoUrl?: string;
  brandName?: string;
  slogan?: string;
  primaryColor?: string;
  accentColor?: string;
  customTitle?: string;
  ctaText?: string;
  tone?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  supportedFormTypes?: ('contact' | 'quote' | 'appointment' | 'callback' | 'estimate' | 'information')[];
  questions?: QualificationQuestion[];
  defaultCampaignId?: string;
}

export interface Site {
  id: string;
  title: string;
  theme: 'formation' | 'immobilier' | 'solaire' | 'agriculture' | 'forage';
  city: string;
  domain: string;
  status: 'active' | 'draft';
  headline: string;
  subheadline: string;
  features: string[];
  chatbotGreeting: string;
  chatbotPersona: string;
  faqs: { question: string; answer: string }[];
  leadsCount: number;
  apiKey?: string;
  brandedConfig?: BrandedFormConfig;
  
  // Compliance & Regulations properties
  isCILCompliant: boolean;
  complianceRating: number; // 0 to 100
  complianceReport: {
    justification: string;
    consentNotice: string;
    legalMentions: string;
    retractionRights: string;
    warnings: string[];
  };
}

export interface ProspectInteraction {
  timestamp: string;
  action: 'initial_capture' | 're_engagement' | 'appointment_booked' | 'quote_requested' | 'callback_requested';
  landingPage?: string;
  formType?: string;
  campaignId?: string;
  details?: string;
}

export interface Lead {
  id: string;
  siteId: string;
  campaignId?: string | null;
  siteTitle: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  rawMessage: string;
  status: 'new' | 'contacted' | 'sold' | 'rejected' | 'WAITING_FOR_PARTNER' | string;
  score: number;
  summarizedNeed: string;
  budget: 'Faible' | 'Moyen' | 'Élevé' | 'Non spécifié';
  urgency: 'Faible' | 'Moyen' | 'Élevé';
  keyPainPoint: string;
  suggestedAction: string;
  responseDraft: string;
  assignedPartnerId: string | null;
  createdAt: string;

  // Origin & Acquisition Tracking
  source?: string; // google_ads, facebook_ads, organic_seo, direct, partner_referral
  landingPage?: string; // URL or identifier of external landing page
  formType?: 'contact' | 'quote' | 'appointment' | 'callback' | 'estimate' | 'information' | string;
  acquisitionPath?: string;
  interactionHistory?: ProspectInteraction[];

  // Security & Compliance additions
  consentCILChecked: boolean; // Consent for Burkina Faso's CIL (Commission de l'Informatique et des Libertés)
  consentPartnerChecked: boolean; // Consent for direct partner transmission
  ipAddress: string;
  isFlaggedAnomaly: boolean; // Security Guardian flag
  securityRiskLevel: 'none' | 'low' | 'high';
  securityLogs: string[];

  // Distribution channels status
  distributionChannels: {
    email: { sent: boolean; sentAt: string | null; recipient: string; error?: string };
    whatsapp: { sent: boolean; sentAt: string | null; formattedMessage: string };
    telegram: { sent: boolean; sentAt: string | null; botCommandTriggered: string };
  };
  distributionType: 'standard' | 'exclusive';
}

export interface CampaignData {
  id: string;
  siteId?: string;
  name: string;
  targetSegment: string;
  targetCity: string;
  sector: string;
  offer?: string;
  status: string; // ACTIVE | PAUSED | COMPLETED
  budget?: number; // Budget allocated in FCFA
  landingPage?: string; // Primary landing page URL
  source?: string; // Main acquisition channel
  createdAt?: string;
}

export interface CampaignAnalytics {
  campaign: CampaignData;
  siteTitle: string;
  totalLeads: number;
  qualifiedLeads: number;
  unqualifiedLeads: number;
  qualificationRate: number; // Percentage
  contactedLeads: number;
  contactRate: number; // Percentage
  convertedLeads: number;
  conversionRate: number; // Percentage
  potentialValue: number; // Calculated value in FCFA
  leadsBySource: Record<string, number>;
  leadsByLandingPage: Record<string, number>;
  leadsByFormType: Record<string, number>;
  assignedPartners: Partner[];
  timePerformance: { date: string; leadsCount: number }[];
}

export interface Partner {
  id: string;
  name: string;
  sector: string;
  city: string;
  geographicScope?: string; // e.g. "Bobo-Dioulasso", "Ouagadougou", "Burkina Faso", "National", "Tous"
  phone: string;
  email: string;
  status: 'discovery' | 'active' | 'suspended';
  
  // Subscription & Payment State
  subscriptionStatus: 'active' | 'expired' | 'canceled';
  subscriptionPlan: 'Starter' | 'Business' | 'Premium';
  subscriptionStartedAt?: string;
  subscriptionExpiresAt?: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  lastPaymentAt?: string;
  nextPaymentDueAt?: string;

  // Quotas & Performance
  leadsReceived: number;
  maxLeadsPerMonth: number;
  revenueGenerated: number;
  exclusiveAccess: boolean;
  
  // Rotation & Fairness
  lastAssignedAt?: string;
  rotationIndex?: number;

  apiKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarketTrend {
  id: string;
  keyword: string;
  sector: string;
  volume: string;
  growth: string;
  description: string;
  opportunity: string;
}

export interface ActivityLog {
  id: string;
  type: 'lead_new' | 'lead_qualified' | 'site_created' | 'partner_matched' | 'system' | 'compliance_warning' | 'security_alert' | 'distribution_success' | 'LEAD_CREATED' | 'LEAD_QUALIFIED' | 'LEAD_ASSIGNED' | 'PARTNER_EMAIL_SENT' | 'PARTNER_EMAIL_FAILED' | 'PARTNER_SUSPENDED' | 'PARTNER_REACTIVATED' | 'PARTNER_PAYMENT_CONFIRMED' | 'WAITING_FOR_PARTNER' | string;
  message: string;
  timestamp: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'access_grant' | 'anomaly_detected' | 'rate_limit' | 'backup_scheduled';
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface DBState {
  sites: Site[];
  leads: Lead[];
  partners: Partner[];
  marketTrends: MarketTrend[];
  activityLogs: ActivityLog[];
  securityEvents: SecurityEvent[];
}

