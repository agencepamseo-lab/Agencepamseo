import React, { useState, useEffect } from 'react';
import { Site, Lead, Partner, CampaignData, CampaignAnalytics, BrandedFormConfig } from '../types';
import { apiFetch } from '../api';
import { 
  BarChart3, Sparkles, Send, Copy, CheckCircle2, AlertTriangle, 
  Layers, ExternalLink, RefreshCw, UserCheck, ShieldCheck, 
  TrendingUp, Code, FileText, ArrowRight, DollarSign, Target, Globe
} from 'lucide-react';

interface Props {
  sites: Site[];
  leads: Lead[];
  partners: Partner[];
  onRefreshData: () => void;
}

export default function CampaignIntelligence({ sites = [], leads = [], partners = [], onRefreshData }: Props) {
  const safeSites = Array.isArray(sites) ? sites : [];
  const safeLeads = Array.isArray(leads) ? leads : [];
  const safePartners = Array.isArray(partners) ? partners : [];

  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [campaignAnalytics, setCampaignAnalytics] = useState<CampaignAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Ingestion Tester State
  const [ingestSiteId, setIngestSiteId] = useState<string>(safeSites[0]?.id || 'site-1');
  const [ingestCampaignId, setIngestCampaignId] = useState<string>('camp-1');
  const [ingestSource, setIngestSource] = useState<string>('google_ads');
  const [ingestLandingPage, setIngestLandingPage] = useState<string>('https://solaire-bobo.com/devis-pompage');
  const [ingestFormType, setIngestFormType] = useState<string>('quote');
  const [ingestName, setIngestName] = useState<string>('Mamadou Sawadogo');
  const [ingestPhone, setIngestPhone] = useState<string>('+226 70 88 99 00');
  const [ingestEmail, setIngestEmail] = useState<string>('mamadou.saw@gmail.com');
  const [ingestCity, setIngestCity] = useState<string>('Bobo-Dioulasso');
  const [ingestMessage, setIngestMessage] = useState<string>('Je souhaite installer un système solaire pour une station de pompage d\'eau agricole à Bobo.');
  const [isSubmittingIngest, setIsSubmittingIngest] = useState(false);
  const [ingestResult, setIngestResult] = useState<any>(null);

  // Branded Form Inspector State
  const [selectedBrandedSiteId, setSelectedBrandedSiteId] = useState<string>(safeSites[0]?.id || 'site-1');
  const [brandedConfig, setBrandedConfig] = useState<any>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await apiFetch('/api/campaigns');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCampaigns(data);
        if (data.length > 0 && !selectedCampaignId) {
          setSelectedCampaignId(data[0].id);
        }
      } else {
        setCampaigns([]);
      }
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      setCampaigns([]);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Fetch analytics when selected campaign changes
  useEffect(() => {
    if (!selectedCampaignId) return;
    const fetchAnalytics = async () => {
      setIsLoadingAnalytics(true);
      try {
        const res = await apiFetch(`/api/campaigns/${selectedCampaignId}/analytics`);
        const data = await res.json();
        setCampaignAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch campaign analytics:', err);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, [selectedCampaignId, leads]);

  // Fetch branded form config
  useEffect(() => {
    if (!selectedBrandedSiteId) return;
    const fetchBrandedConfig = async () => {
      try {
        const res = await apiFetch(`/api/sites/${selectedBrandedSiteId}/branded-config`);
        const data = await res.json();
        setBrandedConfig(data);
      } catch (err) {
        console.error('Failed to fetch branded config:', err);
      }
    };
    fetchBrandedConfig();
  }, [selectedBrandedSiteId]);

  // Handle lead ingestion test
  const handleTestIngestLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingIngest(true);
    setIngestResult(null);

    try {
      const selectedSite = sites.find(s => s.id === ingestSiteId);
      const res = await fetch('/api/ingest-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-LeadFactory-Key': selectedSite?.apiKey || 'lf_key_solaire_bobo_9921'
        },
        body: JSON.stringify({
          siteId: ingestSiteId,
          apiKey: selectedSite?.apiKey,
          campaignId: ingestCampaignId,
          source: ingestSource,
          landingPage: ingestLandingPage,
          formType: ingestFormType,
          name: ingestName,
          phone: ingestPhone,
          email: ingestEmail,
          city: ingestCity,
          rawMessage: ingestMessage,
          consentCIL: true,
          consentPartner: true
        })
      });

      const data = await res.json();
      setIngestResult(data);
      onRefreshData();
    } catch (err) {
      console.error('Ingestion test failed:', err);
      setIngestResult({ error: 'Échec de la connexion à l\'API d\'ingestion.' });
    } finally {
      setIsSubmittingIngest(false);
    }
  };

  const getCurlSnippet = () => {
    const selectedSite = sites.find(s => s.id === ingestSiteId);
    return `curl -X POST "${window.location.origin}/api/ingest-lead" \\
  -H "Content-Type: application/json" \\
  -H "X-LeadFactory-Key: ${selectedSite?.apiKey ? '••••••••' : 'YOUR_SITE_API_KEY'}" \\
  -d '{
    "siteId": "${ingestSiteId}",
    "campaignId": "${ingestCampaignId}",
    "source": "${ingestSource}",
    "landingPage": "${ingestLandingPage}",
    "formType": "${ingestFormType}",
    "name": "${ingestName}",
    "phone": "${ingestPhone}",
    "email": "${ingestEmail}",
    "city": "${ingestCity}",
    "rawMessage": "${ingestMessage}",
    "consentCIL": true,
    "consentPartner": true
  }'`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Lead Factory P0.2 — Campaign Intelligence & Ingestion API
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Intelligence des Campagnes & Ingestion Externe</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Capturez et qualifiez les prospects provenant de vos landing pages autonomes sans rupture de mémoire métier, avec déduplication intelligente et formulaires de marque.
            </p>
          </div>
          <button
            onClick={onRefreshData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Grid: Campaign Intelligence Analytics & Ingestion Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Campaign Intelligence Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Campaign Intelligence</h2>
                  <p className="text-xs text-slate-500">Performance en temps réel et ROI par canal d'acquisition</p>
                </div>
              </div>

              {/* Campaign Selector */}
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {isLoadingAnalytics ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                Chargement de la télémétrie de campagne...
              </div>
            ) : campaignAnalytics ? (
              <div className="space-y-6">
                {/* Campaign Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="text-xs text-slate-500 font-medium">Prospects Totaux</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{campaignAnalytics.totalLeads}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Capturés via API</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <div className="text-xs text-emerald-700 font-medium">Qualifiés (≥ 70)</div>
                    <div className="text-2xl font-black text-emerald-700 mt-1">{campaignAnalytics.qualifiedLeads}</div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">{campaignAnalytics.qualificationRate}% de qualification</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <div className="text-xs text-blue-700 font-medium">Contactés</div>
                    <div className="text-2xl font-black text-blue-700 mt-1">{campaignAnalytics.contactedLeads}</div>
                    <div className="text-[10px] text-blue-600 mt-0.5">{campaignAnalytics.contactRate}% taux de contact</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <div className="text-xs text-amber-700 font-medium">Valeur Estimée</div>
                    <div className="text-xl font-black text-amber-700 mt-1">{campaignAnalytics.potentialValue.toLocaleString()} FCFA</div>
                    <div className="text-[10px] text-amber-600 mt-0.5">ROI prévisionnel</div>
                  </div>
                </div>

                {/* Sources & Landing Pages Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Acquisition Sources */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Sources d'Acquisition</span>
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      {Object.entries(campaignAnalytics.leadsBySource).map(([src, count]) => (
                        <div key={src} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 capitalize">{src.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${Math.min(100, (Number(count) / (campaignAnalytics.totalLeads || 1)) * 100)}%` }}
                              />
                            </div>
                            <span className="font-mono text-slate-600 w-6 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Types Breakdown */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Types de Formulaires</span>
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      {Object.entries(campaignAnalytics.leadsByFormType).map(([ft, count]) => (
                        <div key={ft} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 capitalize">{ft}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-500 h-full rounded-full"
                                style={{ width: `${Math.min(100, (Number(count) / (campaignAnalytics.totalLeads || 1)) * 100)}%` }}
                              />
                            </div>
                            <span className="font-mono text-slate-600 w-6 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Partners Mobilized */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Partenaires Certifiés Assignés
                  </div>
                  {campaignAnalytics.assignedPartners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {campaignAnalytics.assignedPartners.map((p) => (
                        <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-semibold text-slate-900">{p.name}</div>
                            <div className="text-[10px] text-slate-500">{p.city} • Plan {p.subscriptionPlan}</div>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                            {p.leadsReceived}/{p.maxLeadsPerMonth} leads
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">Aucun partenaire assigné pour le moment.</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Branded Form Embedding Inspector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Formulaires de Marque & API d'Ingestion</h3>
                  <p className="text-xs text-slate-500">Configuration des formulaires personnalisés par microsite</p>
                </div>
              </div>
              <select
                value={selectedBrandedSiteId}
                onChange={(e) => setSelectedBrandedSiteId(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                {safeSites.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            {brandedConfig ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 text-xs font-mono relative">
                  <button
                    onClick={() => copyToClipboard(getCurlSnippet())}
                    className="absolute top-3 right-3 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-semibold flex items-center gap-1 border border-slate-700"
                  >
                    {copiedCurl ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCurl ? 'Copié !' : 'Copier cURL'}
                  </button>
                  <div className="text-emerald-400 font-bold mb-2">// Ingestion API Curl Command</div>
                  <pre className="whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">{getCurlSnippet()}</pre>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-bold text-slate-900 mb-2">Paramètres de Marque (Site Memory)</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-slate-400">Titre personnalisé :</span> <span className="font-semibold">{brandedConfig.branding.customTitle}</span></div>
                    <div><span className="text-slate-400">Authentification API :</span> <span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 inline" /> Protégée par clé serveur</span></div>
                    <div><span className="text-slate-400">CTA Formulaire :</span> <span className="font-semibold text-emerald-700">{brandedConfig.branding.ctaText}</span></div>
                    <div><span className="text-slate-400">Conformité CIL :</span> <span className="font-semibold text-blue-700">Conforme Loi 001-2021/AN</span></div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Ingestion Simulator & Deduplication Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Simulateur d'Ingestion API</h2>
                <p className="text-xs text-slate-500">Injestez un prospect depuis une landing page externe</p>
              </div>
            </div>

            <form onSubmit={handleTestIngestLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Microsite Target</label>
                  <select
                    value={ingestSiteId}
                    onChange={(e) => setIngestSiteId(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {safeSites.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Campagne</label>
                  <select
                    value={ingestCampaignId}
                    onChange={(e) => setIngestCampaignId(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Canal (Source)</label>
                  <select
                    value={ingestSource}
                    onChange={(e) => setIngestSource(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                  >
                    <option value="google_ads">Google Ads</option>
                    <option value="facebook_ads">Facebook Ads</option>
                    <option value="organic_seo">SEO Organique</option>
                    <option value="whatsapp_direct">WhatsApp Direct</option>
                    <option value="partner_referral">Recommandation Partenaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Type de Formulaire</label>
                  <select
                    value={ingestFormType}
                    onChange={(e) => setIngestFormType(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                  >
                    <option value="quote">Demande de Devis</option>
                    <option value="contact">Prise de Contact</option>
                    <option value="appointment">Rendez-vous Tech</option>
                    <option value="callback">Rappel Téléphonique</option>
                    <option value="estimate">Estimation Express</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">URL Landing Page Externe</label>
                <input
                  type="text"
                  value={ingestLandingPage}
                  onChange={(e) => setIngestLandingPage(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono"
                  placeholder="https://mon-site-externe.com/offre"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Nom du Prospect</label>
                  <input
                    type="text"
                    value={ingestName}
                    onChange={(e) => setIngestName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Téléphone (+226)</label>
                  <input
                    type="text"
                    value={ingestPhone}
                    onChange={(e) => setIngestPhone(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Email (Optionnel)</label>
                  <input
                    type="email"
                    value={ingestEmail}
                    onChange={(e) => setIngestEmail(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Ville</label>
                  <input
                    type="text"
                    value={ingestCity}
                    onChange={(e) => setIngestCity(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Besoin Brut / Message</label>
                <textarea
                  rows={3}
                  value={ingestMessage}
                  onChange={(e) => setIngestMessage(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingIngest}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                {isSubmittingIngest ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Ingestion & Qualification IA en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer à l'API POST /api/ingest-lead
                  </>
                )}
              </button>
            </form>

            {/* Ingestion Result Box */}
            {ingestResult && (
              <div className="mt-6 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Résultat Ingestion API</span>
                  {ingestResult.isExistingProspect ? (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 font-bold rounded-full text-[10px] flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      Mémoire Prospect : Ré-engagement
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Nouveau Prospect Dédupliqué
                    </span>
                  )}
                </div>

                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-2 overflow-x-auto">
                  <div className="text-emerald-400 font-bold">Status: {ingestResult.success ? '200 OK' : 'Error'}</div>
                  {ingestResult.lead && (
                    <>
                      <div><span className="text-slate-500">ID:</span> {ingestResult.lead.id}</div>
                      <div><span className="text-slate-500">Score IA:</span> <span className="text-amber-400 font-bold">{ingestResult.lead.score}/100</span></div>
                      <div><span className="text-slate-500">Besoin:</span> {ingestResult.lead.summarizedNeed}</div>
                      <div><span className="text-slate-500">Parcours:</span> <span className="text-blue-300">{ingestResult.lead.acquisitionPath}</span></div>
                      <div><span className="text-slate-500">Partenaire Assigné:</span> {ingestResult.matchedPartner ? ingestResult.matchedPartner.name : 'En attente'}</div>
                      <div><span className="text-slate-500">Historique Interactions:</span> {ingestResult.lead.interactionHistory?.length || 1} session(s)</div>
                    </>
                  )}
                  {ingestResult.error && (
                    <div className="text-rose-400">{ingestResult.error}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
