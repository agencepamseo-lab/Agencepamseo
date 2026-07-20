import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK securely on the server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("⚠️ GEMINI_API_KEY variable is missing. AI features will fallback to deterministic generation.");
}

const app = express();
app.use(express.json());

// ==========================================
// MOCK DATABASE & STATE
// ==========================================

interface Site {
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

interface Lead {
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
  consentCILChecked: boolean;
  consentPartnerChecked: boolean;
  ipAddress: string;
  isFlaggedAnomaly: boolean;
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

interface Partner {
  id: string;
  name: string;
  sector: string;
  city: string;
  phone: string;
  email: string;
  status: 'discovery' | 'active' | 'suspended';
  leadsReceived: number;
  maxLeadsPerMonth: number;
  subscriptionPlan: 'Starter' | 'Business' | 'Premium';
  revenueGenerated: number;
  exclusiveAccess: boolean;
}

interface MarketTrend {
  id: string;
  keyword: string;
  sector: string;
  volume: string;
  growth: string;
  description: string;
  opportunity: string;
}

interface ActivityLog {
  id: string;
  type: 'lead_new' | 'lead_qualified' | 'site_created' | 'partner_matched' | 'system' | 'compliance_warning' | 'security_alert' | 'distribution_success';
  message: string;
  timestamp: string;
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'access_grant' | 'anomaly_detected' | 'rate_limit' | 'backup_scheduled';
  description: string;
  severity: 'info' | 'warning' | 'critical';
}


// Initial realistic data focused on Burkina Faso (Bobo-Dioulasso and Ouagadougou)
let db = {
  sites: [
    {
      id: "site-1",
      title: "Faso Solaire Solutions",
      theme: "solaire",
      city: "Bobo-Dioulasso",
      domain: "solaire-bobo.leadfactory.africa",
      status: "active",
      headline: "Installez vos panneaux solaires au meilleur prix à Bobo-Dioulasso",
      subheadline: "Demandez votre devis gratuit en 2 minutes. Des experts certifiés installent des kits solaires robustes pour maisons, commerces et forages.",
      features: [
        "Kits solaires complets (panneaux, batterie, onduleur) garantie 5 ans",
        "Installation certifiée par des techniciens locaux basés à Bobo",
        "Support technique ultra-rapide et service après-vente de proximité"
      ],
      chatbotGreeting: "Bonjour ! Je suis l'assistant IA de Faso Solaire. Souhaitez-vous installer des panneaux solaires pour votre maison, commerce ou pour un système d'irrigation à Bobo-Dioulasso ?",
      chatbotPersona: "Vous êtes un ingénieur solaire chaleureux et rigoureux basé à Bobo-Dioulasso. Vous guidez les clients locaux vers les meilleurs devis.",
      faqs: [
        { question: "Quel est le prix moyen d'un kit solaire pour maison ?", answer: "Nos offres commencent à 350 000 FCFA pour un kit d'éclairage et ventilation de base, et s'adaptent selon vos besoins." },
        { question: "Combien de temps dure l'installation ?", answer: "Une fois le devis validé, l'installation complète prend généralement de 24 à 48 heures." },
        { question: "Vos équipements sont-ils garantis ?", answer: "Oui, tous nos panneaux sont garantis 10 ans et nos batteries de 2 à 5 ans selon la gamme." }
      ],
      leadsCount: 14,
      isCILCompliant: true,
      complianceRating: 98,
      complianceReport: {
        justification: "Le site respecte les exigences de la Loi N°001-2021/AN du Burkina Faso sur la protection des données personnelles.",
        consentNotice: "Formulaire intégrant une case à cocher explicite pour la transmission des données de contact.",
        legalMentions: "Mentions légales identifiant clairement l'éditeur LeadFactory Africa AI et l'hébergeur agréé.",
        retractionRights: "Mention explicite du droit d'accès et de rectification auprès de la CIL Burkina.",
        warnings: []
      }
    },
    {
      id: "site-2",
      title: "Académie Tech du Houet",
      theme: "formation",
      city: "Bobo-Dioulasso",
      domain: "formations-ia.leadfactory.africa",
      status: "active",
      headline: "Formez-vous aux métiers de l'Intelligence Artificielle et du Digital à Bobo",
      subheadline: "Des programmes intensifs, pratiques et adaptés au marché burkinabè pour propulser votre carrière ou moderniser votre entreprise.",
      features: [
        "Formations 100% pratiques animées par des experts du secteur",
        "Projets réels et accompagnement à l'insertion professionnelle",
        "Formules flexibles en cours du soir ou week-end"
      ],
      chatbotGreeting: "Bienvenue sur la plateforme de l'Académie Tech ! Quelle compétence digitale souhaitez-vous acquérir (IA, Marketing, Développement Web) à Bobo-Dioulasso ?",
      chatbotPersona: "Vous êtes un conseiller d'orientation passionné par l'essor du numérique au Burkina Faso. Vous encouragez les jeunes et les professionnels.",
      faqs: [
        { question: "Est-ce accessible aux débutants ?", answer: "Absolument ! Nos modules 'Zéro à Héros' ne nécessitent aucun prérequis technique." },
        { question: "Où se déroulent les cours ?", answer: "Dans nos locaux connectés situés au centre-ville de Bobo-Dioulasso, ou en ligne selon la formule." }
      ],
      leadsCount: 9,
      isCILCompliant: true,
      complianceRating: 95,
      complianceReport: {
        justification: "Le site respecte les standards de la CIL et de la RGPD.",
        consentNotice: "Case d'acceptation obligatoire avant soumission des coordonnées.",
        legalMentions: "Mentions légales conformes indiquant l'Académie Tech du Houet comme responsable de traitement.",
        retractionRights: "Option de désinscription disponible par email direct.",
        warnings: ["Ajouter le numéro d'agrément de formation professionnelle dès réception."]
      }
    },
    {
      id: "site-3",
      title: "Immo-Houet Pro",
      theme: "immobilier",
      city: "Bobo-Dioulasso",
      domain: "immo-bobo.leadfactory.africa",
      status: "active",
      headline: "Trouvez votre terrain ou logement idéal à Bobo-Dioulasso sans intermédiaire suspect",
      subheadline: "Accédez à des offres de location, d'achat de parcelles sécurisées et d'estimations immobilières certifiées par des professionnels agréés.",
      features: [
        "Parcelles avec titres fonciers clairs et vérifiés par un notaire",
        "Visites gratuites et accompagnement personnalisé de A à Z",
        "Estimation rapide de la valeur locative ou marchande de vos biens"
      ],
      chatbotGreeting: "Bonjour ! Cherchez-vous à acheter un terrain sécurisé, louer une villa ou faire estimer un bien immobilier à Bobo-Dioulasso ?",
      chatbotPersona: "Vous êtes un agent immobilier expérimenté, honnête et très au fait des prix des quartiers comme Sarfalao, Koko et Belleville à Bobo.",
      faqs: [
        { question: "Comment être sûr que la parcelle est sécurisée ?", answer: "Chaque terrain proposé sur notre site est audité juridiquement avec un acte de cession ou un titre foncier en règle." },
        { question: "Faites-vous de la gestion locative ?", answer: "Oui, nos partenaires s'occupent de la perception de vos loyers et de l'entretien de vos immeubles." }
      ],
      leadsCount: 18,
      isCILCompliant: true,
      complianceRating: 92,
      complianceReport: {
        justification: "Données de prospection collectées avec double consentement explicite.",
        consentNotice: "Consentement séparé pour le traitement local (CIL) et le transfert vers le partenaire immobilier.",
        legalMentions: "Identité de l'agence immobilière partenaire clairement affichée.",
        retractionRights: "Droits de retrait exerçables à tout moment.",
        warnings: ["Le formulaire doit mentionner que les visites de parcelles respectent la réglementation de l'urbanisme local."]
      }
    }
  ] as Site[],

  leads: [
    {
      id: "lead-1",
      siteId: "site-1",
      siteTitle: "Faso Solaire Solutions",
      name: "Ousmane Ouédraogo",
      phone: "+226 70 12 34 56",
      email: "ousmane.oued@gmail.com",
      city: "Bobo-Dioulasso",
      rawMessage: "Bonjour, je cherche un système solaire complet pour ma clinique privée à Sarfalao. Nous subissons trop de délestages et cela endommage nos équipements médicaux. J'ai un budget d'environ 2 500 000 FCFA. J'aimerais une autonomie d'au moins 6 heures pour l'éclairage et 2 réfrigérateurs de vaccins.",
      status: "new",
      score: 95,
      summarizedNeed: "Installation solaire autonome (min 6h) pour clinique médicale privée afin de parer aux délestages.",
      budget: "Élevé",
      urgency: "Élevé",
      keyPainPoint: "Les coupures d'électricité récurrentes mettent en péril la conservation des vaccins et le fonctionnement de la clinique.",
      suggestedAction: "Planifier une visite technique d'urgence à la clinique pour évaluer la puissance des réfrigérateurs et concevoir un devis adapté.",
      responseDraft: "Bonjour M. Ouédraogo,\n\nVotre demande a été priorisée par Faso Solaire. Les délestages à Sarfalao nécessitent effectivement une installation robuste pour sécuriser vos réfrigérateurs médicaux. Nous disposons d'équipements médicaux spécialisés avec batteries lithium. Un de nos ingénieurs partenaires va vous contacter pour fixer un rendez-vous technique d'ici ce soir.\n\nCordialement,\nLeadFactory - Faso Solaire Bobo",
      assignedPartnerId: "partner-1",
      createdAt: "2026-07-20T05:30:00Z",
      consentCILChecked: true,
      consentPartnerChecked: true,
      ipAddress: "196.28.245.12",
      isFlaggedAnomaly: false,
      securityRiskLevel: "none" as const,
      securityLogs: [
        "Vérification IP géographique : Ouagadougou/Bobo-Dioulasso - Cohérente",
        "Analyse de formulaire : Taux de remplissage 100%",
        "Format téléphone valide : indicatif +226 vérifié"
      ],
      distributionChannels: {
        email: { sent: true, sentAt: "2026-07-20T05:32:00Z", recipient: "contact@sinergisolaire.bf" },
        whatsapp: { sent: true, sentAt: "2026-07-20T05:32:05Z", formattedMessage: "Nouveau prospect Solaire ! Ousmane Ouédraogo recherche un kit solaire autonome pour une clinique à Sarfalao. Budget estimé : Élevé." },
        telegram: { sent: true, sentAt: "2026-07-20T05:32:10Z", botCommandTriggered: "/prospect lead-1" }
      },
      distributionType: "exclusive" as const
    },
    {
      id: "lead-2",
      siteId: "site-3",
      siteTitle: "Immo-Houet Pro",
      name: "Mariam Traoré",
      phone: "+226 76 98 76 54",
      email: "mariam.traore@outlook.com",
      city: "Bobo-Dioulasso",
      rawMessage: "Je cherche une maison à louer de 3 pièces (2 chambres + salon) avec cour fermée et garage à Belleville ou Accart-ville. Mon budget mensuel maximum est de 120 000 FCFA. C'est urgent car mon contrat actuel se termine à la fin du mois.",
      status: "contacted",
      score: 88,
      summarizedNeed: "Recherche de location de maison 3 pièces avec cour fermée et garage à Belleville/Accart-ville (budget max 120 000 FCFA/mois).",
      budget: "Moyen",
      urgency: "Élevé",
      keyPainPoint: "Fin de contrat de bail imminente (fin du mois), risque de se retrouver sans logement.",
      suggestedAction: "Proposer immédiatement les 3 fiches de villas correspondantes dans notre catalogue de Belleville et organiser les visites.",
      responseDraft: "Bonjour Mme Traoré,\n\nNous avons bien reçu votre recherche urgente de villa 3 pièces à Belleville. C'est un quartier très demandé mais notre partenaire immobilier local possède actuellement deux options avec cour fermée à 110 000 FCFA et 125 000 FCFA. Nous vous appelons dans l'heure pour caler les visites gratuites.\n\nExcellente journée,\nLeadFactory Immo-Houet",
      assignedPartnerId: "partner-3",
      createdAt: "2026-07-19T14:15:00Z",
      consentCILChecked: true,
      consentPartnerChecked: true,
      ipAddress: "196.28.245.45",
      isFlaggedAnomaly: false,
      securityRiskLevel: "none" as const,
      securityLogs: [
        "Vérification IP géographique : Bobo-Dioulasso - Cohérente",
        "Validation de la syntaxe email : OK"
      ],
      distributionChannels: {
        email: { sent: true, sentAt: "2026-07-19T14:16:00Z", recipient: "bobo@houetcleimmo.bf" },
        whatsapp: { sent: false, sentAt: null, formattedMessage: "" },
        telegram: { sent: true, sentAt: "2026-07-19T14:16:15Z", botCommandTriggered: "/prospect lead-2" }
      },
      distributionType: "standard" as const
    },
    {
      id: "lead-3",
      siteId: "site-2",
      siteTitle: "Académie Tech du Houet",
      name: "Moussa Sawadogo",
      phone: "+226 65 43 21 09",
      email: "moussa.sawa@univ-bobo.bf",
      city: "Bobo-Dioulasso",
      rawMessage: "Je suis étudiant en fin de cycle informatique à l'UPB. Je voudrais savoir s'il y a des sessions de formation pratique en IA et Machine Learning cet été, et si vous proposez des réductions pour les étudiants car mes moyens sont limités.",
      status: "sold",
      score: 75,
      summarizedNeed: "Demande d'information sur une formation d'été pratique en IA/Machine Learning avec réduction étudiante.",
      budget: "Faible",
      urgency: "Moyen",
      keyPainPoint: "Manque de compétences pratiques en IA sur le cursus universitaire classique et budget limité.",
      suggestedAction: "L'inscrire sur la liste d'attente de la cohorte d'août et lui proposer la formule 'bourse jeune talent digital' à -30%.",
      responseDraft: "Bonjour Moussa,\n\nFélicitations pour ton parcours à l'UPB ! Oui, nous lançons le module 'Pratique IA & Data' en cours du soir dès le 1er août. Un tarif spécial étudiant à 70 000 FCFA au lieu de 100 000 FCFA éligible sur présentation de ta carte. Notre conseiller de l'Académie Tech t'appellera pour valider ton inscription.\n\nÀ très vite ! Académie Tech",
      assignedPartnerId: "partner-2",
      createdAt: "2026-07-18T09:40:00Z",
      consentCILChecked: true,
      consentPartnerChecked: true,
      ipAddress: "196.28.240.89",
      isFlaggedAnomaly: false,
      securityRiskLevel: "none" as const,
      securityLogs: [
        "Vérification IP géographique : Campus UPB Bobo - Cohérente",
        "Niveau de risque : Nul"
      ],
      distributionChannels: {
        email: { sent: true, sentAt: "2026-07-18T09:42:00Z", recipient: "info@isth-bobo.com" },
        whatsapp: { sent: true, sentAt: "2026-07-18T09:42:12Z", formattedMessage: "Nouveau prospect formation : Moussa Sawadogo (IA/Machine Learning). Plan d'action : Proposer réduction étudiant." },
        telegram: { sent: false, sentAt: null, botCommandTriggered: "" }
      },
      distributionType: "standard" as const
    }
  ] as Lead[],

  partners: [
    {
      id: "partner-1",
      name: "Sinergi Solaire S.A.R.L.",
      sector: "solaire",
      city: "Bobo-Dioulasso",
      phone: "+226 25 30 11 22",
      email: "contact@sinergisolaire.bf",
      status: "active",
      leadsReceived: 8,
      maxLeadsPerMonth: 25,
      subscriptionPlan: "Business",
      revenueGenerated: 160000, // In CFA
      exclusiveAccess: false
    },
    {
      id: "partner-2",
      name: "Institut Supérieur de Technologie du Houet",
      sector: "formation",
      city: "Bobo-Dioulasso",
      phone: "+226 20 97 00 11",
      email: "info@isth-bobo.com",
      status: "active",
      leadsReceived: 5,
      maxLeadsPerMonth: 9999,
      subscriptionPlan: "Premium",
      revenueGenerated: 350000,
      exclusiveAccess: true
    },
    {
      id: "partner-3",
      name: "Houet Clé Immo",
      sector: "immobilier",
      city: "Bobo-Dioulasso",
      phone: "+226 20 98 44 55",
      email: "bobo@houetcleimmo.bf",
      status: "discovery",
      leadsReceived: 4,
      maxLeadsPerMonth: 10,
      subscriptionPlan: "Starter",
      revenueGenerated: 0,
      exclusiveAccess: false
    }
  ] as Partner[],

  marketTrends: [
    {
      id: "trend-1",
      keyword: "Panneau solaire irrigation Bobo",
      sector: "solaire",
      volume: "Élevé",
      growth: "+48%",
      description: "Les maraîchers de la plaine de Bobo-Dioulasso cherchent massivement à remplacer les motopompes à essence par des pompes solaires en raison du coût du carburant.",
      opportunity: "Créer un tunnel d'acquisition focalisé sur l'irrigation agricole solaire pour la région des Hauts-Bassins."
    },
    {
      id: "trend-2",
      keyword: "Formation IA certifiante Burkina",
      sector: "formation",
      volume: "Très Élevé",
      growth: "+65%",
      description: "Forte augmentation de la demande en formations courtes et pratiques sur ChatGPT, l'IA générative et l'automatisation par les PME et cadres locaux.",
      opportunity: "Lancer un microsite ciblant les chefs d'entreprise pour des formations 'Productivité IA' intra-entreprise."
    },
    {
      id: "trend-3",
      keyword: "Location meublée Belleville Bobo",
      sector: "immobilier",
      volume: "Moyen",
      growth: "+22%",
      description: "Hausse des demandes de logements de moyen/haut standing meublés pour les professionnels en mission temporaire à Bobo-Dioulasso.",
      opportunity: "Générer un site de capture spécialisé dans l'hébergement d'affaires et la location meublée temporaire."
    },
    {
      id: "trend-4",
      keyword: "Forage d'eau agricole prix",
      sector: "forage",
      volume: "Élevé",
      growth: "+30%",
      description: "Les promoteurs immobiliers et les coopératives agricoles exigent de plus en plus des devis directs pour les forages d'eau avec pompe immergée.",
      opportunity: "Déployer une plateforme simple 'Forage Devis Faso' connectant les clients aux foreurs certifiés."
    },
    {
      id: "trend-5",
      keyword: "Couveuse automatique solaire Bobo",
      sector: "agriculture",
      volume: "Moyen",
      growth: "+40%",
      description: "Les éleveurs de volailles s'intéressent aux couveuses fonctionnant sur batteries ou panneaux solaires pour éliminer les pertes de poussins dues aux coupures.",
      opportunity: "Créer un site vitrine pour la commande de kits d'incubation solaire."
    }
  ] as MarketTrend[],

  activityLogs: [
    { id: "log-1", type: "system", message: "Initialisation réussie de la plateforme LeadFactory Africa AI à Bobo-Dioulasso.", timestamp: "2026-07-20T01:00:00Z" },
    { id: "log-2", type: "site_created", message: "Nouveau microsite déployé : Académie Tech du Houet.", timestamp: "2026-07-20T02:30:00Z" },
    { id: "log-3", type: "lead_new", message: "Nouveau prospect reçu : Ousmane Ouédraogo (Solaire Bobo).", timestamp: "2026-07-20T05:30:00Z" },
    { id: "log-4", type: "lead_qualified", message: "Qualification IA effectuée pour Ousmane Ouédraogo. Score : 95/100 (Prospect Chaud).", timestamp: "2026-07-20T05:31:00Z" },
    { id: "log-5", type: "partner_matched", message: "Prospect Ousmane Ouédraogo automatiquement affecté à Sinergi Solaire S.A.R.L. via Distribution Intelligente.", timestamp: "2026-07-20T05:32:00Z" }
  ] as ActivityLog[],

  securityEvents: [
    { id: "sec-1", timestamp: "2026-07-20T01:00:00Z", eventType: "access_grant", description: "Vérification des droits d'accès RBAC : Admin connecté.", severity: "info" },
    { id: "sec-2", timestamp: "2026-07-20T02:00:00Z", eventType: "backup_scheduled", description: "Sauvegarde automatisée du registre central CIL complétée.", severity: "info" }
  ] as SecurityEvent[]
};


// ==========================================
// API ENDPOINTS
// ==========================================

// Get all dynamic state
app.get("/api/data", (req, res) => {
  res.json(db);
});

// Reset database to initial state
app.post("/api/data/reset", (req, res) => {
  db.sites = [
    {
      id: "site-1",
      title: "Faso Solaire Solutions",
      theme: "solaire",
      city: "Bobo-Dioulasso",
      domain: "solaire-bobo.leadfactory.africa",
      status: "active",
      headline: "Installez vos panneaux solaires au meilleur prix à Bobo-Dioulasso",
      subheadline: "Demandez votre devis gratuit en 2 minutes. Des experts certifiés installent des kits solaires robustes pour maisons, commerces et forages.",
      features: [
        "Kits solaires complets (panneaux, batterie, onduleur) garantie 5 ans",
        "Installation certifiée par des techniciens locaux basés à Bobo",
        "Support technique ultra-rapide et service après-vente de proximité"
      ],
      chatbotGreeting: "Bonjour ! Je suis l'assistant IA de Faso Solaire. Souhaitez-vous installer des panneaux solaires pour votre maison, commerce ou pour un système d'irrigation à Bobo-Dioulasso ?",
      chatbotPersona: "Vous êtes un ingénieur solaire chaleureux et rigoureux basé à Bobo-Dioulasso. Vous guidez les clients locaux vers les meilleurs devis.",
      faqs: [
        { question: "Quel est le prix moyen d'un kit solaire pour maison ?", answer: "Nos offres commencent à 350 000 FCFA pour un kit d'éclairage et ventilation de base, et s'adaptent selon vos besoins." },
        { question: "Combien de temps dure l'installation ?", answer: "Une fois le devis validé, l'installation complète prend généralement de 24 à 48 heures." },
        { question: "Vos équipements sont-ils garantis ?", answer: "Oui, tous nos panneaux sont garantis 10 ans et nos batteries de 2 à 5 ans selon la gamme." }
      ],
      leadsCount: 14,
      isCILCompliant: true,
      complianceRating: 98,
      complianceReport: {
        justification: "Le site respecte les exigences de la Loi N°001-2021/AN du Burkina Faso sur la protection des données personnelles.",
        consentNotice: "Formulaire intégrant une case à cocher explicite pour la transmission des données de contact.",
        legalMentions: "Mentions légales identifiant clairement l'éditeur LeadFactory Africa AI.",
        retractionRights: "Mention explicite du droit d'accès et de rectification auprès de la CIL Burkina.",
        warnings: []
      }
    },
    {
      id: "site-2",
      title: "Académie Tech du Houet",
      theme: "formation",
      city: "Bobo-Dioulasso",
      domain: "formations-ia.leadfactory.africa",
      status: "active",
      headline: "Formez-vous aux métiers de l'Intelligence Artificielle et du Digital à Bobo",
      subheadline: "Des programmes intensifs, pratiques et adaptés au marché burkinabè pour propulser votre carrière ou moderniser votre entreprise.",
      features: [
        "Formations 100% pratiques animées par des experts du secteur",
        "Projets réels et accompagnement à l'insertion professionnelle",
        "Formules flexibles en cours du soir ou week-end"
      ],
      chatbotGreeting: "Bienvenue sur la plateforme de l'Académie Tech ! Quelle compétence digitale souhaitez-vous acquérir (IA, Marketing, Développement Web) à Bobo-Dioulasso ?",
      chatbotPersona: "Vous êtes un conseiller d'orientation passionné par l'essor du numérique au Burkina Faso. Vous encouragez les jeunes et les professionnels.",
      faqs: [
        { question: "Est-ce accessible aux débutants ?", answer: "Absolument ! Nos modules 'Zéro à Héros' ne nécessitent aucun prérequis technique." },
        { question: "Où se déroulent les cours ?", answer: "Dans nos locaux connectés situés au centre-ville de Bobo-Dioulasso, ou en ligne selon la formule." }
      ],
      leadsCount: 9,
      isCILCompliant: true,
      complianceRating: 95,
      complianceReport: {
        justification: "Le site respecte les standards de la CIL et de la RGPD.",
        consentNotice: "Case d'acceptation obligatoire avant soumission des coordonnées.",
        legalMentions: "Mentions légales conformes indiquant l'Académie Tech du Houet comme responsable de traitement.",
        retractionRights: "Option de désinscription disponible par email direct.",
        warnings: ["Ajouter le numéro d'agrément de formation professionnelle dès réception."]
      }
    },
    {
      id: "site-3",
      title: "Immo-Houet Pro",
      theme: "immobilier",
      city: "Bobo-Dioulasso",
      domain: "immo-bobo.leadfactory.africa",
      status: "active",
      headline: "Trouvez votre terrain ou logement idéal à Bobo-Dioulasso sans intermédiaire suspect",
      subheadline: "Accédez à des offres de location, d'achat de parcelles sécurisées et d'estimations immobilières certifiées par des professionnels agréés.",
      features: [
        "Parcelles avec titres fonciers clairs et vérifiés par un notaire",
        "Visites gratuites et accompagnement personnalisé de A à Z",
        "Estimation rapide de la valeur locative ou marchande de vos biens"
      ],
      chatbotGreeting: "Bonjour ! Cherchez-vous à acheter un terrain sécurisé, louer une villa ou faire estimer un bien immobilier à Bobo-Dioulasso ?",
      chatbotPersona: "Vous êtes un agent immobilier expérimenté, honnête et très au fait des prix des quartiers comme Sarfalao, Koko et Belleville à Bobo.",
      faqs: [
        { question: "Comment être sûr que la parcelle est sécurisée ?", answer: "Chaque terrain proposé sur notre site est audité juridiquement avec un acte de cession ou un titre foncier en règle." },
        { question: "Faites-vous de la gestion locative ?", answer: "Oui, nos partenaires s'occupent de la perception de vos loyers et de l'entretien de vos immeubles." }
      ],
      leadsCount: 18,
      isCILCompliant: true,
      complianceRating: 92,
      complianceReport: {
        justification: "Conformité CIL globalement respectée.",
        consentNotice: "Acceptation explicite de mise en relation avec des agences immobilières agréées.",
        legalMentions: "Mentions de l'éditeur conformes.",
        retractionRights: "Droit d'opposition et de suppression gratuit.",
        warnings: []
      }
    }
  ];

  db.leads = [
    {
      id: "lead-1",
      siteId: "site-1",
      siteTitle: "Faso Solaire Solutions",
      name: "Ousmane Ouédraogo",
      phone: "+226 70 12 34 56",
      email: "ousmane.oued@gmail.com",
      city: "Bobo-Dioulasso",
      rawMessage: "Bonjour, je cherche un système solaire complet pour ma clinique privée à Sarfalao. Nous subissons trop de délestages et cela endommage nos équipements médicaux. J'ai un budget d'environ 2 500 000 FCFA. J'aimerais une autonomie d'au moins 6 heures pour l'éclairage et 2 réfrigérateurs de vaccins.",
      status: "new",
      score: 95,
      summarizedNeed: "Installation solaire autonome (min 6h) pour clinique médicale privée afin de parer aux délestages.",
      budget: "Élevé",
      urgency: "Élevé",
      keyPainPoint: "Les coupures d'électricité récurrentes mettent en péril la conservation des vaccins et le fonctionnement de la clinique.",
      suggestedAction: "Planifier une visite technique d'urgence à la clinique pour évaluer la puissance des réfrigérateurs et concevoir un devis adapté.",
      responseDraft: "Bonjour M. Ouédraogo,\n\nVotre demande a été priorisée par Faso Solaire. Les délestages à Sarfalao nécessitent effectivement une installation robuste pour sécuriser vos réfrigérateurs médicaux. Nous disposons d'équipements médicaux spécialisés avec batteries lithium. Un de nos ingénieurs partenaires va vous contacter pour fixer un rendez-vous technique d'ici ce soir.\n\nCordialement,\nLeadFactory - Faso Solaire Bobo",
      assignedPartnerId: "partner-1",
      createdAt: new Date().toISOString(),
      consentCILChecked: true,
      consentPartnerChecked: true,
      ipAddress: "197.239.32.41",
      isFlaggedAnomaly: false,
      securityRiskLevel: "none",
      securityLogs: ["Consentement CIL enregistré", "Origine IP Bobo-Dioulasso validée"],
      distributionChannels: {
        email: { sent: true, sentAt: new Date().toISOString(), recipient: "contact@sinergisolaire.bf" },
        whatsapp: { sent: false, sentAt: null, formattedMessage: "" },
        telegram: { sent: false, sentAt: null, botCommandTriggered: "" }
      },
      distributionType: "standard"
    }
  ];

  db.partners = [
    {
      id: "partner-1",
      name: "Sinergi Solaire S.A.R.L.",
      sector: "solaire",
      city: "Bobo-Dioulasso",
      phone: "+226 25 30 11 22",
      email: "contact@sinergisolaire.bf",
      status: "active",
      leadsReceived: 8,
      maxLeadsPerMonth: 25,
      subscriptionPlan: "Business",
      revenueGenerated: 160000,
      exclusiveAccess: false
    },
    {
      id: "partner-2",
      name: "Institut Supérieur de Technologie du Houet",
      sector: "formation",
      city: "Bobo-Dioulasso",
      phone: "+226 20 97 00 11",
      email: "info@isth-bobo.com",
      status: "active",
      leadsReceived: 5,
      maxLeadsPerMonth: 9999,
      subscriptionPlan: "Premium",
      revenueGenerated: 350000,
      exclusiveAccess: true
    },
    {
      id: "partner-3",
      name: "Houet Clé Immo",
      sector: "immobilier",
      city: "Bobo-Dioulasso",
      phone: "+226 20 98 44 55",
      email: "bobo@houetcleimmo.bf",
      status: "discovery",
      leadsReceived: 4,
      maxLeadsPerMonth: 10,
      subscriptionPlan: "Starter",
      revenueGenerated: 0,
      exclusiveAccess: false
    }
  ];

  db.activityLogs = [
    { id: "log-" + Date.now(), type: "system", message: "Base de données réinitialisée aux valeurs d'origine.", timestamp: new Date().toISOString() }
  ];

  res.json({ success: true, state: db });
});

// Create active site
app.post("/api/sites", (req, res) => {
  const isCILCompliant = req.body.isCILCompliant !== undefined ? req.body.isCILCompliant : true;
  const rating = isCILCompliant ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 30) + 40;

  const newSite: Site = {
    id: "site-" + Date.now(),
    title: req.body.title || "Nouveau Site",
    theme: req.body.theme || "solaire",
    city: req.body.city || "Bobo-Dioulasso",
    domain: req.body.domain || `${req.body.title?.toLowerCase().replace(/\s+/g, '-') || 'site'}.leadfactory.africa`,
    status: req.body.status || "active",
    headline: req.body.headline || "Un service d'exception à votre écoute",
    subheadline: req.body.subheadline || "Contactez nos techniciens locaux qualifiés.",
    features: req.body.features || ["Qualité garantie", "Meilleur prix", "Service réactif"],
    chatbotGreeting: req.body.chatbotGreeting || "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    chatbotPersona: req.body.chatbotPersona || "Vous êtes un conseiller clientèle chaleureux.",
    faqs: req.body.faqs || [
      { question: "Quels sont vos délais ?", answer: "Nous répondons sous 24h ouvrées." },
      { question: "Comment obtenir un devis ?", answer: "Remplissez simplement le formulaire ci-dessus !" }
    ],
    leadsCount: 0,
    isCILCompliant,
    complianceRating: rating,
    complianceReport: {
      justification: isCILCompliant 
        ? "Audit de conformité LeadFactory : Mentions de consentement et d'information CIL détectées."
        : "AVERTISSEMENT : Manque d'information claire sur la destination des données de contact.",
      consentNotice: isCILCompliant 
        ? "Formulaire avec case à cocher explicite CIL validée."
        : "Case à cocher absente ou pré-cochée (non-conforme).",
      legalMentions: "LeadFactory Africa AI est désigné comme co-traitant de données.",
      retractionRights: "Droit de suppression et d'accès garanti conformément à la loi du Burkina Faso.",
      warnings: isCILCompliant ? [] : ["Rétablir le double consentement actif pour transmission directe."]
    }
  };

  db.sites.push(newSite);

  db.activityLogs.unshift({
    id: "log-" + Date.now(),
    type: "site_created",
    message: `Nouveau microsite généré et déployé : ${newSite.title} (${newSite.city})`,
    timestamp: new Date().toISOString()
  });

  res.status(201).json(newSite);
});

// Create new partner
app.post("/api/partners", (req, res) => {
  const plan: 'Starter' | 'Business' | 'Premium' = req.body.subscriptionPlan || "Starter";
  const maxLeads = plan === "Premium" ? 9999 : (plan === "Business" ? 25 : 10);
  
  const newPartner: Partner = {
    id: "partner-" + Date.now(),
    name: req.body.name,
    sector: req.body.sector,
    city: req.body.city || "Bobo-Dioulasso",
    phone: req.body.phone,
    email: req.body.email,
    status: "discovery",
    leadsReceived: 0,
    maxLeadsPerMonth: maxLeads,
    subscriptionPlan: plan,
    revenueGenerated: 0,
    exclusiveAccess: plan === "Premium"
  };

  db.partners.push(newPartner);

  db.activityLogs.unshift({
    id: "log-" + Date.now(),
    type: "partner_matched",
    message: `Nouveau partenaire enregistré (${plan}) : ${newPartner.name} en ${newPartner.sector}`,
    timestamp: new Date().toISOString()
  });

  res.status(201).json(newPartner);
});


// Update lead status/partner
app.put("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  const { status, assignedPartnerId } = req.body;

  const leadIndex = db.leads.findIndex(l => l.id === id);
  if (leadIndex === -1) {
    return res.status(404).json({ error: "Lead not found" });
  }

  const oldLead = db.leads[leadIndex];
  const oldStatus = oldLead.status;

  db.leads[leadIndex] = {
    ...oldLead,
    status: status !== undefined ? status : oldLead.status,
    assignedPartnerId: assignedPartnerId !== undefined ? assignedPartnerId : oldLead.assignedPartnerId
  };

  const updatedLead = db.leads[leadIndex];

  // Log matching / conversion changes
  if (status === "sold" && oldStatus !== "sold") {
    // Generate simulated revenue for the partner if they are standard/premium
    if (updatedLead.assignedPartnerId) {
      const partner = db.partners.find(p => p.id === updatedLead.assignedPartnerId);
      if (partner) {
        // Average value of a sold lead is ~15,000 CFA for the subscription/commission
        partner.revenueGenerated += 15000;
        db.activityLogs.unshift({
          id: "log-" + Date.now(),
          type: "system",
          message: `Opportunité convertie ! Revenu commission généré pour ${partner.name} : +15 000 FCFA.`,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  if (assignedPartnerId && assignedPartnerId !== oldLead.assignedPartnerId) {
    const partner = db.partners.find(p => p.id === assignedPartnerId);
    if (partner) {
      partner.leadsReceived += 1;
      db.activityLogs.unshift({
        id: "log-" + Date.now(),
        type: "partner_matched",
        message: `Prospect [${updatedLead.name}] attribué manuellement au partenaire ${partner.name}.`,
        timestamp: new Date().toISOString()
      });
    }
  }

  res.json(updatedLead);
});

// Delete or modify site
app.delete("/api/sites/:id", (req, res) => {
  const { id } = req.params;
  const initialCount = db.sites.length;
  db.sites = db.sites.filter(s => s.id !== id);

  if (db.sites.length < initialCount) {
    db.activityLogs.unshift({
      id: "log-" + Date.now(),
      type: "system",
      message: `Microsite avec ID ${id} supprimé de la liste active.`,
      timestamp: new Date().toISOString()
    });
    return res.json({ success: true });
  }
  res.status(404).json({ error: "Site non trouvé." });
});


// ==========================================
// GEMINI INTELLIGENCE API ENDPOINTS
// ==========================================

// 1. Market Research Opportunity Detection
app.post("/api/market-analysis", async (req, res) => {
  const { city = "Bobo-Dioulasso", sector = "Tous" } = req.body;

  if (!ai) {
    // Return mock analysis if API key is missing
    return res.json({
      opportunities: [
        {
          keyword: `Solaire pour maraîchage ${city}`,
          sector: "solaire",
          volume: "Élevé",
          growth: "+55%",
          description: "La recherche de pompage solaire augmente en raison du coût élevé et des pannes de motopompes fossiles.",
          opportunity: "Lancer un microsite dédié à l'irrigation autonome à Bobo-Dioulasso."
        },
        {
          keyword: `Formation accélérée en informatique ${city}`,
          sector: "formation",
          volume: "Moyen",
          growth: "+40%",
          description: "Demande de certificats professionnels rapides et abordables chez les jeunes diplômés.",
          opportunity: "Déployer le template de formation Académie Houet."
        }
      ],
      aiAnalysis: `Analyse simulée pour la région de ${city}. La demande énergétique et la formation professionnelle restent les deux piliers de croissance les plus forts sur le marché local actuellement.`
    });
  }

  try {
    const prompt = `Vous êtes un analyste de marché et expert SEO spécialisé en Afrique de l'Ouest, notamment au Burkina Faso. 
Analyse les tendances actuelles et opportunités d'affaires pour la ville de: ${city}. 
Secteur demandé: ${sector}.

Génère une liste de 3 opportunités de marchés de prospects très demandés localement qui peuvent être capturés par des microsites de génération de prospects. 
Donne pour chaque opportunité:
1. Un mot-clé de recherche populaire localement (ex: "panneaux solaires bobo", "forage eau pas cher")
2. Le secteur d'activité (formation, immobilier, solaire, agriculture, forage, services)
3. Le volume estimé (Élevé / Moyen / Faible)
4. La croissance annuelle estimée (ex: "+35%")
5. Une description du besoin du client (pourquoi ils cherchent cela)
6. L'opportunité concrète pour un microsite de capture.

Fournis également un court paragraphe d'analyse stratégique globale pour cette ville.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            opportunities: {
              type: Type.ARRAY,
              description: "Liste des opportunités détectées",
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  sector: { type: Type.STRING },
                  volume: { type: Type.STRING },
                  growth: { type: Type.STRING },
                  description: { type: Type.STRING },
                  opportunity: { type: Type.STRING }
                },
                required: ["keyword", "sector", "volume", "growth", "description", "opportunity"]
              }
            },
            aiAnalysis: {
              type: Type.STRING,
              description: "Courte analyse stratégique globale en français."
            }
          },
          required: ["opportunities", "aiAnalysis"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);

  } catch (error: any) {
    console.error("Gemini Market Analysis Error:", error);
    res.status(500).json({ error: "Failed to generate market analysis", details: error.message });
  }
});

// 2. Intelligent Site Generator Content
app.post("/api/generate-site-content", async (req, res) => {
  const { theme, city = "Bobo-Dioulasso", customSector = "" } = req.body;

  if (!ai) {
    // Mock response if API key is missing
    const generatedTitle = `Faso ${theme.charAt(0).toUpperCase() + theme.slice(1)} Pro`;
    return res.json({
      title: generatedTitle,
      domain: `${theme}-${city.toLowerCase().replace(/\s+/g, '-')}.leadfactory.africa`,
      headline: `Trouvez les meilleurs prestataires en ${theme} à ${city}`,
      subheadline: "Formulaire de mise en relation directe. Obtenez 3 devis gratuits de professionnels certifiés sous 24 heures.",
      features: [
        "Sélection rigoureuse d'entreprises de confiance",
        "Zéro intermédiaire inutile, contact rapide",
        "100% gratuit et sans engagement"
      ],
      chatbotGreeting: `Bonjour ! Bienvenue sur notre plateforme spécialisée en ${theme}. Comment puis-je vous aider à concrétiser votre besoin à ${city} ?`,
      chatbotPersona: `Vous êtes un conseiller commercial expert en ${theme} pour la région de ${city}.`,
      faqs: [
        { question: "Comment ça marche ?", answer: "Vous remplissez le formulaire, notre IA qualifie votre besoin et vous met en contact avec le meilleur pro de la ville." },
        { question: "Est-ce gratuit ?", answer: "Oui, la demande de mise en relation est entièrement gratuite pour les particuliers." }
      ]
    });
  }

  try {
    const prompt = `Vous êtes l'Agent Website Builder et l'Agent SEO de LeadFactory Africa AI.
Concevez le contenu complet, optimisé pour le référencement local et hautement persuasif d'un microsite d'acquisition commerciale.
Thème demandé: ${theme}
Ville cible au Burkina Faso: ${city}
Précision sectorielle: ${customSector}

Le microsite doit cibler la population locale qui a un besoin pressant dans ce secteur.
Génère de manière structurée:
1. Un titre d'entreprise/plateforme local d'acquisition (ex: "Faso Solaire Solutions" ou "Immo-Houet Pro")
2. Un nom de domaine fictif adapté (ex: "solaire-bobo.leadfactory.africa")
3. Un titre principal (Headline) accrocheur axé sur la valeur ajoutée et la localité
4. Un sous-titre persuasif invitant à remplir le formulaire
5. 3 points forts/bénéfices clés du service (features)
6. Un message de bienvenue engageant pour le chatbot d'assistance (chatbotGreeting)
7. Un descriptif de la personnalité de ce chatbot (chatbotPersona)
8. Une liste de 2 ou 3 questions fréquemment posées (FAQs) avec des réponses adaptées à la réalité économique burkinabè (monnaie: FCFA).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            domain: { type: Type.STRING },
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            features: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            chatbotGreeting: { type: Type.STRING },
            chatbotPersona: { type: Type.STRING },
            faqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            }
          },
          required: ["title", "domain", "headline", "subheadline", "features", "chatbotGreeting", "chatbotPersona", "faqs"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);

  } catch (error: any) {
    console.error("Gemini Site Generator Error:", error);
    res.status(500).json({ error: "Failed to generate site content", details: error.message });
  }
});

// 3. AI Lead Qualification & Automatic Matchmaking
app.post("/api/qualify-lead", async (req, res) => {
  const { siteId, name, phone, email, city, rawMessage, consentCILChecked = true, consentPartnerChecked = true } = req.body;

  const site = db.sites.find(s => s.id === siteId) || { title: "Service Général", theme: "forage", isCILCompliant: true };

  // --- SECURITY GUARDIAN ANOMALY DETECTION ---
  const generatedIp = "196.28." + Math.floor(Math.random() * 254 + 1) + "." + Math.floor(Math.random() * 254 + 1);
  let isFlaggedAnomaly = false;
  let securityRiskLevel: 'none' | 'low' | 'high' = 'none';
  const securityLogs: string[] = [
    "Démarrage du scan de sécurité par Security Guardian AI...",
    `Adresse IP détectée : ${generatedIp} (Burkina Faso)`
  ];

  // Anomaly Check 1: SQL Injection or malicious patterns
  const maliciousPatterns = [/select /i, /drop /i, /union /i, /or 1\s*=\s*1/i, /<script/i];
  const isMalicious = maliciousPatterns.some(pattern => pattern.test(rawMessage) || pattern.test(name));
  
  // Anomaly Check 2: Fake/Suspicious numbers
  const isFakePhone = phone.includes("000000") || phone.length < 8;

  if (isMalicious) {
    isFlaggedAnomaly = true;
    securityRiskLevel = 'high';
    securityLogs.push("ALERTE : Tentative d'injection SQL ou script malveillant détectée ! Saisie bloquée en quarantaine.");
  } else if (isFakePhone) {
    isFlaggedAnomaly = true;
    securityRiskLevel = 'low';
    securityLogs.push("ATTENTION : Numéro de téléphone suspect ou incomplet saisi par l'utilisateur.");
  } else {
    securityLogs.push("Analyse anti-spam : Négative (Prospect légitime)");
    securityLogs.push("Format du numéro : Conforme aux opérateurs nationaux (Moov / Orange / Telecel).");
  }

  if (isFlaggedAnomaly) {
    db.securityEvents.unshift({
      id: "sec-" + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: "anomaly_detected",
      description: `Activité suspecte détectée lors de la soumission du formulaire par '${name}' depuis l'IP ${generatedIp}. Niveau : ${securityRiskLevel}.`,
      severity: securityRiskLevel === 'high' ? 'critical' : 'warning'
    });
    db.activityLogs.unshift({
      id: "log-" + Date.now(),
      type: "security_alert",
      message: `[Sécurité] Tentative d'activité suspecte bloquée/signalée pour le prospect ${name}.`,
      timestamp: new Date().toISOString()
    });
  }

  // --- PREPARE THE MATCHMAKING ALGORITHM ---
  const findBestPartner = (sector: string, distributionType: 'standard' | 'exclusive') => {
    // Filter active, non-suspended partners in the correct sector
    const matchingPartners = db.partners.filter(p => p.sector === sector && p.status !== "suspended");
    
    // Quota filter: leads received < maxLeadsPerMonth
    const activeQuotaPartners = matchingPartners.filter(p => p.leadsReceived < p.maxLeadsPerMonth);

    if (activeQuotaPartners.length === 0) return null;

    if (distributionType === 'exclusive') {
      // Prioritize Premium partners first
      const premiumPartners = activeQuotaPartners.filter(p => p.subscriptionPlan === 'Premium');
      if (premiumPartners.length > 0) {
        return premiumPartners.sort((a, b) => a.leadsReceived - b.leadsReceived)[0];
      }
    }

    // Default matchmaking: sort by leadsReceived (faire-share distribution)
    return activeQuotaPartners.sort((a, b) => a.leadsReceived - b.leadsReceived)[0];
  };

  if (!ai) {
    // Fallback deterministic qualification
    const computedScore = isFlaggedAnomaly ? 30 : (rawMessage.length > 100 ? 85 : 65);
    const budgetEstimation = computedScore >= 80 ? "Élevé" : "Moyen";
    const distType = computedScore >= 85 ? "exclusive" : "standard";

    // Matching Partner
    const matchedPartner = findBestPartner(site.theme, distType);
    let assignedId = null;
    if (matchedPartner && !isFlaggedAnomaly) {
      assignedId = matchedPartner.id;
      matchedPartner.leadsReceived += 1;
    }

    const fallbackLead: Lead = {
      id: "lead-" + Date.now(),
      siteId,
      siteTitle: site.title,
      name,
      phone,
      email: email || "non-precise@mail.com",
      city: city || "Bobo-Dioulasso",
      rawMessage,
      status: "new",
      score: computedScore,
      summarizedNeed: `Demande de service ${site.theme} pour ${name}.`,
      budget: budgetEstimation,
      urgency: computedScore >= 80 ? "Élevé" : "Moyen",
      keyPainPoint: "Recherche de solutions de confiance locales à " + (city || "Bobo-Dioulasso"),
      suggestedAction: "Prendre contact sous 2 heures par téléphone.",
      responseDraft: `Bonjour ${name},\n\nNous avons bien reçu votre demande concernant notre service ${site.title}. Un professionnel certifié partenaire à ${city || "Bobo-Dioulasso"} vous contactera sous peu pour vous soumettre un devis détaillé.\n\nCordialement,\nLeadFactory Africa AI`,
      assignedPartnerId: assignedId,
      createdAt: new Date().toISOString(),
      consentCILChecked: !!consentCILChecked,
      consentPartnerChecked: !!consentPartnerChecked,
      ipAddress: generatedIp,
      isFlaggedAnomaly,
      securityRiskLevel,
      securityLogs,
      distributionType: distType,
      distributionChannels: {
        email: { 
          sent: matchedPartner ? true : false, 
          sentAt: matchedPartner ? new Date().toISOString() : null, 
          recipient: matchedPartner ? matchedPartner.email : "" 
        },
        whatsapp: { 
          sent: matchedPartner ? true : false, 
          sentAt: matchedPartner ? new Date().toISOString() : null, 
          formattedMessage: `LeadFactory : Nouveau prospect ${name} (${phone}) disponible pour ${site.title}.` 
        },
        telegram: { 
          sent: matchedPartner ? true : false, 
          sentAt: matchedPartner ? new Date().toISOString() : null, 
          botCommandTriggered: `/prospect lead-${Date.now()}` 
        }
      }
    };

    db.leads.unshift(fallbackLead);

    // Update site lead counter
    const siteObj = db.sites.find(s => s.id === siteId);
    if (siteObj) siteObj.leadsCount += 1;

    // Log matching / compliance check
    db.activityLogs.unshift({
      id: "log-" + Date.now(),
      type: isFlaggedAnomaly ? "compliance_warning" : "lead_qualified",
      message: isFlaggedAnomaly 
        ? `[ALERTE SÉCURITÉ] Prospect suspect '${name}' bloqué/flaggué par le Guardian AI.`
        : `Nouveau prospect ${name} qualifié. Score: ${computedScore}/100. Affecté à: ${matchedPartner ? matchedPartner.name : 'Non affecté (Quota plein ou Suspense)'}`,
      timestamp: new Date().toISOString()
    });

    if (matchedPartner && !isFlaggedAnomaly) {
      db.activityLogs.unshift({
        id: "log-" + Date.now(),
        type: "distribution_success",
        message: `[Distribution] Opportunité transmise avec succès à ${matchedPartner.name} via Email et SMS/WhatsApp.`,
        timestamp: new Date().toISOString()
      });
    }

    return res.json(fallbackLead);
  }

  try {
    const prompt = `Vous êtes l'Agent Lead Qualification et l'Agent Conversion de LeadFactory Africa AI.
Un prospect vient de soumettre ses informations et son besoin brut via l'un de nos microsites d'acquisition.
Détails du microsite:
- Nom du site: ${site.title}
- Thème d'activité: ${site.theme}

Détails saisis par le prospect:
- Nom complet: ${name}
- Téléphone: ${phone}
- Email: ${email || "Non spécifié"}
- Ville: ${city || "Bobo-Dioulasso"}
- Message brut écrit par le client: "${rawMessage}"

Analyse avec soin et rigueur la demande en français pour qualifier le lead.
Renvoie les informations suivantes:
1. Un score de qualité du prospect (leadScore) de 0 à 100. Un score élevé (>= 80) signifie que la demande contient un besoin clair, un numéro de téléphone valide, une urgence élevée, et des détails quantifiables.
2. Un besoin résumé en une phrase simple et professionnelle (summarizedNeed).
3. Estimation du budget (budgetEstimation): Choisir strictement parmi 'Faible', 'Moyen', 'Élevé' ou 'Non spécifié'.
4. Urgence détectée (urgency): Choisir strictement parmi 'Faible', 'Moyen' ou 'Élevé'.
5. Point de blocage/douleur principal du client (keyPainPoint): Qu'est-ce qui le frustre le plus dans son message ?
6. Action commerciale suggérée pour le prestataire (suggestedAction) en quelques mots.
7. Un projet de message personnalisé de réponse automatique commerciale (responseDraft) prêt à envoyer par SMS ou WhatsApp en français. Le message doit être courtois, mentionner le prénom, montrer que son besoin a été compris (ex: les délestages à Bobo-Dioulasso, le forage pour les manguiers, etc.), et annoncer la mise en relation avec un partenaire agréé.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            leadScore: { type: Type.INTEGER, description: "Score sur 100 de la qualité du lead." },
            summarizedNeed: { type: Type.STRING, description: "Résumé court du besoin du prospect." },
            budgetEstimation: { type: Type.STRING, description: "Budget estimé parmi: 'Faible', 'Moyen', 'Élevé', 'Non spécifié'" },
            urgency: { type: Type.STRING, description: "Urgence estimée parmi: 'Faible', 'Moyen', 'Élevé'" },
            keyPainPoint: { type: Type.STRING, description: "La douleur principale identifiée." },
            suggestedAction: { type: Type.STRING, description: "Action commerciale recommandée." },
            responseDraft: { type: Type.STRING, description: "Message d'accueil commercial rédigé par l'IA." }
          },
          required: ["leadScore", "summarizedNeed", "budgetEstimation", "urgency", "keyPainPoint", "suggestedAction", "responseDraft"]
        }
      }
    });

    const aiResult = JSON.parse(response.text || "{}");

    const computedScore = isFlaggedAnomaly ? 25 : (aiResult.leadScore || 70);
    const distType = computedScore >= 80 ? "exclusive" : "standard";

    // Matching Partner
    const matchedPartner = isFlaggedAnomaly ? null : findBestPartner(site.theme, distType);
    let assignedId = null;
    if (matchedPartner) {
      assignedId = matchedPartner.id;
      matchedPartner.leadsReceived += 1;
    }

    // Construct full Lead Object
    const fullLead: Lead = {
      id: "lead-" + Date.now(),
      siteId,
      siteTitle: site.title,
      name,
      phone,
      email: email || "non-precise@mail.com",
      city: city || "Bobo-Dioulasso",
      rawMessage,
      status: "new",
      score: computedScore,
      summarizedNeed: aiResult.summarizedNeed || `Demande ${site.theme}`,
      budget: aiResult.budgetEstimation || "Non spécifié",
      urgency: aiResult.urgency || "Moyen",
      keyPainPoint: aiResult.keyPainPoint || "Recherche de solution",
      suggestedAction: aiResult.suggestedAction || "Contacter le prospect",
      responseDraft: aiResult.responseDraft || "Bonjour, nous traitons votre demande.",
      assignedPartnerId: assignedId,
      createdAt: new Date().toISOString(),
      consentCILChecked: !!consentCILChecked,
      consentPartnerChecked: !!consentPartnerChecked,
      ipAddress: generatedIp,
      isFlaggedAnomaly,
      securityRiskLevel,
      securityLogs,
      distributionType: distType,
      distributionChannels: {
        email: { 
          sent: matchedPartner ? true : false, 
          sentAt: matchedPartner ? new Date().toISOString() : null, 
          recipient: matchedPartner ? matchedPartner.email : "" 
        },
        whatsapp: { 
          sent: matchedPartner ? true : false, 
          sentAt: matchedPartner ? new Date().toISOString() : null, 
          formattedMessage: `LeadFactory : Nouveau prospect ${name} (${phone}) disponible pour ${site.title}.` 
        },
        telegram: { 
          sent: matchedPartner ? true : false, 
          sentAt: matchedPartner ? new Date().toISOString() : null, 
          botCommandTriggered: `/prospect lead-${Date.now()}` 
        }
      }
    };

    db.leads.unshift(fullLead);

    // Increment lead counts
    const siteObj = db.sites.find(s => s.id === siteId);
    if (siteObj) siteObj.leadsCount += 1;

    db.activityLogs.unshift({
      id: "log-" + Date.now(),
      type: isFlaggedAnomaly ? "compliance_warning" : "lead_qualified",
      message: isFlaggedAnomaly 
        ? `[ALERTE SÉCURITÉ] Prospect suspect '${name}' bloqué/flaggué par le Guardian AI.`
        : `Nouveau prospect qualifié par l'IA : ${name} (${site.title}) - Score : ${fullLead.score}/100`,
      timestamp: new Date().toISOString()
    });

    if (matchedPartner) {
      db.activityLogs.unshift({
        id: "log-" + Date.now(),
        type: "distribution_success",
        message: `[Distribution] Opportunité transmise avec succès à ${matchedPartner.name} via Email et WhatsApp.`,
        timestamp: new Date().toISOString()
      });
    }

    res.json(fullLead);

  } catch (error: any) {
    console.error("Gemini Qualification Error:", error);
    res.status(500).json({ error: "Failed to qualify lead via AI", details: error.message });
  }
});

// Endpoint for Campaign Compliance Audits
app.post("/api/compliance/audit-campaign", async (req, res) => {
  const { title, slogan, description } = req.body;

  if (!ai) {
    const isCompliant = !slogan.toLowerCase().includes("gratuit à 100% à vie") && !slogan.toLowerCase().includes("gagner 1 000 000 par jour");
    return res.json({
      isCompliant,
      rating: isCompliant ? 94 : 45,
      recommendations: isCompliant 
        ? ["Slogan sain et réaliste. Aucun problème détecté."] 
        : ["ATTENTION : Éviter les promesses trompeuses ou irréalistes de gains financiers.", "Spécifier clairement les conditions de gratuité."]
    });
  }

  try {
    const prompt = `Vous êtes l'Agent Compliance de LeadFactory Africa AI, spécialisé dans la réglementation de la publicité et de la protection des données au Burkina Faso.
Analysez le slogan commercial de cette campagne d'acquisition de prospects :
Titre : "${title}"
Slogan : "${slogan}"
Description : "${description}"

Identifiez s'il y a des promesses mensongères ou déceptives (par ex: "gratuit à vie sans condition", "revenu garanti de 2 000 000 FCFA").
Renvoie :
1. Un boolean de conformité (isCompliant)
2. Une note sur 100 (rating)
3. 2 ou 3 recommandations d'amélioration réglementaire (recommendations)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCompliant: { type: Type.BOOLEAN },
            rating: { type: Type.INTEGER },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["isCompliant", "rating", "recommendations"]
        }
      }
    });

    const auditResult = JSON.parse(response.text || "{}");
    res.json(auditResult);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for Backup triggering
app.post("/api/security/backup", (req, res) => {
  const backupId = "bkp-" + Date.now();
  
  db.securityEvents.unshift({
    id: "sec-" + Date.now(),
    timestamp: new Date().toISOString(),
    eventType: "backup_scheduled",
    description: `Sauvegarde complète initiée par l'administrateur. Fichier : archive-leadfactory-${backupId}.json. Registre CIL chiffré AES-256 sauvegardé avec succès sur le serveur sécurisé.`,
    severity: "info"
  });

  db.activityLogs.unshift({
    id: "log-" + Date.now(),
    type: "system",
    message: `Sauvegarde de sécurité centralisée effectuée : archive-leadfactory-${backupId}.json`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, backupId, timestamp: new Date().toISOString() });
});


// 4. Chatbot Assist on individual microsites
app.post("/api/chatbot", async (req, res) => {
  const { siteId, message, conversationHistory = [] } = req.body;

  const site = db.sites.find(s => s.id === siteId);
  if (!site) {
    return res.status(404).json({ error: "Site non trouvé." });
  }

  if (!ai) {
    return res.json({
      text: `[Simulation] Merci pour votre intérêt pour ${site.title}. Pour des raisons techniques (clé API en cours de configuration), nous vous invitons à remplir directement notre formulaire afin de recevoir un devis gratuit et personnalisé par nos partenaires agréés à ${site.city}.`
    });
  }

  try {
    // Format conversation history for Gemini
    const systemPrompt = `Vous êtes l'assistant virtuel IA (chatbot) officiel du microsite d'acquisition commerciale nommé: ${site.title}.
Thème du site: ${site.theme} (formation, immobilier, solaire, agriculture, forage, etc.)
Ville cible au Burkina Faso: ${site.city}

Votre personnalité:
${site.chatbotPersona}

Directives de communication:
- Soyez accueillant, poli, concis et serviable.
- Exprimez-vous en français avec des tournures respectueuses adaptées à la culture burkinabè (ex: "Bienvenue !", "Chaleureuses salutations", etc.).
- Ne donnez jamais d'estimations de prix fermes et arbitraires mais proposez plutôt de remplir le formulaire d'estimation/demande pour obtenir un tarif gratuit et exact par un technicien local.
- Soulignez que nos partenaires sont basés localement à ${site.city} et sont hautement certifiés.
- Si le prospect pose des questions sur les tarifs ou la faisabilité, expliquez gentiment que notre formulaire d'IA transmettra ses coordonnées à l'entreprise la plus compétente pour un rappel gratuit.

Question du client: "${message}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
    });

    res.json({ text: response.text });

  } catch (error: any) {
    console.error("Gemini Chatbot Error:", error);
    res.json({ text: "Désolé, j'ai rencontré un problème pour traiter votre message. Veuillez soumettre vos coordonnées dans le formulaire ci-dessus pour qu'un conseiller vous rappelle directement." });
  }
});


// ==========================================
// VITE DEV SERVER & PRODUCTION STATIC SERVER
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 LeadFactory Africa AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
