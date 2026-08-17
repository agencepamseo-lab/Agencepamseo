import { Site, Lead, Partner, MarketTrend, ActivityLog, SecurityEvent } from '../types.js';

export const initialSites: Site[] = [
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
    apiKey: "lf_key_solaire_bobo_9921",
    brandedConfig: {
      logoUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=100&auto=format&fit=crop",
      brandName: "Faso Solaire Solutions",
      slogan: "L'énergie solaire durable & accessible au Burkina Faso",
      primaryColor: "#059669",
      accentColor: "#d97706",
      customTitle: "Faso Solaire — Diagnostic & Devis Gratuit",
      ctaText: "Demander mon devis Solaire",
      tone: "Technique, rassurant et orienté retour sur investissement",
      contactInfo: {
        phone: "+226 20 97 00 11",
        email: "contact@faso-solaire.bf",
        address: "Zone Industrielle, Bobo-Dioulasso"
      },
      supportedFormTypes: ["quote", "contact", "appointment", "estimate"],
      questions: [
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
          ],
          placeholder: "Sélectionnez votre type d'installation"
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
          label: "Quartier ou localité de l'installation à Bobo-Dioulasso",
          type: "location",
          required: true,
          placeholder: "Ex: Sarfalao, Koko, Belleville, Banakeledaga..."
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
          options: [
            "Urgent (Moins de 7 jours)",
            "Dans le mois",
            "Projet d'ici 2 à 3 mois"
          ]
        }
      ],
      defaultCampaignId: "camp-1"
    },
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
    apiKey: "lf_key_academie_tech_8812",
    brandedConfig: {
      logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop",
      brandName: "Académie Tech du Houet",
      slogan: "Excellence & Compétences Numériques d'Avenir",
      primaryColor: "#2563eb",
      accentColor: "#f59e0b",
      customTitle: "Académie Tech — Candidature & Orientation",
      ctaText: "S'inscrire à la formation IA",
      tone: "Pédagogique, dynamique et axé sur l'employabilité",
      contactInfo: {
        phone: "+226 20 98 44 22",
        email: "admissions@academie-tech.bf",
        address: "Avenue de l'Indépendance, Bobo-Dioulasso"
      },
      supportedFormTypes: ["contact", "appointment", "information"],
      questions: [
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
          options: [
            "Immédiatement (Prochaine cohorte)",
            "Dans le trimestre à venir",
            "Simple demande d'information / Programme"
          ]
        }
      ],
      defaultCampaignId: "camp-2"
    },
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
];

export const initialCampaigns = [
  {
    id: "camp-1",
    siteId: "site-1",
    name: "Campagne Solaire Cliniques & Commerces Bobo",
    targetSegment: "ENTERPRISE",
    targetCity: "Bobo-Dioulasso",
    sector: "solaire",
    offer: "Installation Solaire Autonome avec batterie Lithium",
    status: "ACTIVE",
    budget: 250000,
    landingPage: "https://solaire-bobo.com/devis-pompage",
    source: "google_ads",
    createdAt: "2026-07-01T08:00:00Z"
  },
  {
    id: "camp-2",
    siteId: "site-2",
    name: "Campagne Formation IA Cadres & Étudiants",
    targetSegment: "EXECUTIVE",
    targetCity: "Bobo-Dioulasso",
    sector: "formation",
    offer: "Pratique IA & Data pour professionnels",
    status: "ACTIVE",
    budget: 150000,
    landingPage: "https://academie-tech.bf/ia-exec-2026",
    source: "facebook_ads",
    createdAt: "2026-07-05T09:00:00Z"
  },
  {
    id: "camp-3",
    siteId: "site-3",
    name: "Campagne Immobilier Résidentiel Belleville",
    targetSegment: "PROJECT",
    targetCity: "Bobo-Dioulasso",
    sector: "immobilier",
    offer: "Location & Vente Parcelles Sécurisées",
    status: "ACTIVE",
    budget: 200000,
    landingPage: "https://immo-bobo.bf/parcelles-belleville",
    source: "organic_seo",
    createdAt: "2026-07-10T10:00:00Z"
  }
];

export const initialLeads: Lead[] = [
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
    securityRiskLevel: "none",
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
    distributionType: "exclusive"
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
    securityRiskLevel: "none",
    securityLogs: [
      "Vérification IP géographique : Bobo-Dioulasso - Cohérente",
      "Validation de la syntaxe email : OK"
    ],
    distributionChannels: {
      email: { sent: true, sentAt: "2026-07-19T14:16:00Z", recipient: "bobo@houetcleimmo.bf" },
      whatsapp: { sent: false, sentAt: null, formattedMessage: "" },
      telegram: { sent: true, sentAt: "2026-07-19T14:16:15Z", botCommandTriggered: "/prospect lead-2" }
    },
    distributionType: "standard"
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
    securityRiskLevel: "none",
    securityLogs: [
      "Vérification IP géographique : Campus UPB Bobo - Cohérente",
      "Niveau de risque : Nul"
    ],
    distributionChannels: {
      email: { sent: true, sentAt: "2026-07-18T09:42:00Z", recipient: "info@isth-bobo.com" },
      whatsapp: { sent: true, sentAt: "2026-07-18T09:42:12Z", formattedMessage: "Nouveau prospect formation : Moussa Sawadogo (IA/Machine Learning). Plan d'action : Proposer réduction étudiant." },
      telegram: { sent: false, sentAt: null, botCommandTriggered: "" }
    },
    distributionType: "standard"
  }
];

export const initialPartners: Partner[] = [
  {
    id: "partner-1",
    name: "Sinergi Solaire S.A.R.L.",
    sector: "solaire",
    city: "Bobo-Dioulasso",
    geographicScope: "Bobo-Dioulasso",
    phone: "+226 25 30 11 22",
    email: "contact@sinergisolaire.bf",
    status: "active",
    subscriptionStatus: "active",
    subscriptionPlan: "Business",
    subscriptionStartedAt: "2026-07-01T00:00:00Z",
    subscriptionExpiresAt: "2026-09-01T00:00:00Z",
    paymentStatus: "paid",
    lastPaymentAt: "2026-07-01T08:00:00Z",
    nextPaymentDueAt: "2026-09-01T00:00:00Z",
    leadsReceived: 8,
    maxLeadsPerMonth: 25,
    revenueGenerated: 160000,
    exclusiveAccess: false,
    rotationIndex: 0
  },
  {
    id: "partner-2",
    name: "Institut Supérieur de Technologie du Houet",
    sector: "formation",
    city: "Bobo-Dioulasso",
    geographicScope: "Burkina Faso",
    phone: "+226 20 97 00 11",
    email: "info@isth-bobo.com",
    status: "active",
    subscriptionStatus: "active",
    subscriptionPlan: "Premium",
    subscriptionStartedAt: "2026-07-01T00:00:00Z",
    subscriptionExpiresAt: "2026-09-01T00:00:00Z",
    paymentStatus: "paid",
    lastPaymentAt: "2026-07-01T08:00:00Z",
    nextPaymentDueAt: "2026-09-01T00:00:00Z",
    leadsReceived: 5,
    maxLeadsPerMonth: 9999,
    revenueGenerated: 350000,
    exclusiveAccess: true,
    rotationIndex: 0
  },
  {
    id: "partner-3",
    name: "Houet Clé Immo",
    sector: "immobilier",
    city: "Bobo-Dioulasso",
    geographicScope: "Bobo-Dioulasso",
    phone: "+226 20 98 44 55",
    email: "bobo@houetcleimmo.bf",
    status: "active",
    subscriptionStatus: "active",
    subscriptionPlan: "Starter",
    subscriptionStartedAt: "2026-07-15T00:00:00Z",
    subscriptionExpiresAt: "2026-09-15T00:00:00Z",
    paymentStatus: "paid",
    lastPaymentAt: "2026-07-15T08:00:00Z",
    nextPaymentDueAt: "2026-09-15T00:00:00Z",
    leadsReceived: 4,
    maxLeadsPerMonth: 10,
    revenueGenerated: 0,
    exclusiveAccess: false,
    rotationIndex: 0
  }
];

export const initialMarketTrends: MarketTrend[] = [
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
];

export const initialActivityLogs: ActivityLog[] = [
  { id: "log-1", type: "system", message: "Initialisation réussie de la plateforme LeadFactory Africa AI à Bobo-Dioulasso.", timestamp: "2026-07-20T01:00:00Z" },
  { id: "log-2", type: "site_created", message: "Nouveau microsite déployé : Académie Tech du Houet.", timestamp: "2026-07-20T02:30:00Z" },
  { id: "log-3", type: "lead_new", message: "Nouveau prospect reçu : Ousmane Ouédraogo (Solaire Bobo).", timestamp: "2026-07-20T05:30:00Z" },
  { id: "log-4", type: "lead_qualified", message: "Qualification IA effectuée pour Ousmane Ouédraogo. Score : 95/100 (Prospect Chaud).", timestamp: "2026-07-20T05:31:00Z" },
  { id: "log-5", type: "partner_matched", message: "Prospect Ousmane Ouédraogo automatiquement affecté à Sinergi Solaire S.A.R.L. via Distribution Intelligente.", timestamp: "2026-07-20T05:32:00Z" }
];

export const initialSecurityEvents: SecurityEvent[] = [
  { id: "sec-1", timestamp: "2026-07-20T01:00:00Z", eventType: "access_grant", description: "Vérification des droits d'accès RBAC : Admin connecté.", severity: "info" },
  { id: "sec-2", timestamp: "2026-07-20T02:00:00Z", eventType: "backup_scheduled", description: "Sauvegarde automatisée du registre central CIL complétée.", severity: "info" }
];
