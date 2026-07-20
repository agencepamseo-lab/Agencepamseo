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

export interface Lead {
  id: string;
  siteId: string;
  siteTitle: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  rawMessage: string;
  status: 'new' | 'contacted' | 'sold' | 'rejected';
  score: number;
  summarizedNeed: string;
  budget: 'Faible' | 'Moyen' | 'Élevé' | 'Non spécifié';
  urgency: 'Faible' | 'Moyen' | 'Élevé';
  keyPainPoint: string;
  suggestedAction: string;
  responseDraft: string;
  assignedPartnerId: string | null;
  createdAt: string;

  // Security & Compliance additions
  consentCILChecked: boolean; // Consent for Burkina Faso's CIL (Commission de l'Informatique et des Libertés)
  consentPartnerChecked: boolean; // Consent for direct partner transmission
  ipAddress: string;
  isFlaggedAnomaly: boolean; // Security Guardian flag
  securityRiskLevel: 'none' | 'low' | 'high';
  securityLogs: string[];

  // Distribution channels status
  distributionChannels: {
    email: { sent: boolean; sentAt: string | null; recipient: string };
    whatsapp: { sent: boolean; sentAt: string | null; formattedMessage: string };
    telegram: { sent: boolean; sentAt: string | null; botCommandTriggered: string };
  };
  distributionType: 'standard' | 'exclusive';
}

export interface Partner {
  id: string;
  name: string;
  sector: string;
  city: string;
  phone: string;
  email: string;
  status: 'discovery' | 'active' | 'suspended';
  leadsReceived: number;
  maxLeadsPerMonth: number;
  subscriptionPlan: 'Starter' | 'Business' | 'Premium'; // updated to Starter/Business/Premium
  revenueGenerated: number;
  exclusiveAccess: boolean; // exclusive access flag
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
  type: 'lead_new' | 'lead_qualified' | 'site_created' | 'partner_matched' | 'system' | 'compliance_warning' | 'security_alert' | 'distribution_success';
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

