import React, { useState, useEffect } from 'react';
import { Site, Lead, QualificationQuestion, CampaignData } from '../types';
import { 
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Bot, 
  Send, Loader2, Settings, Plus, Trash2, Edit3, Globe, 
  Check, Phone, Mail, MapPin, AlertTriangle, Layers, UserCheck, 
  Building2, Sun, GraduationCap, Building, Droplets, Leaf,
  RotateCcw, Sliders, ExternalLink, MessageSquare
} from 'lucide-react';

interface DynamicLeadFactoryPageProps {
  sites: Site[];
  currentSiteId?: string;
  onLeadCreated?: (lead: Lead) => void;
  onSiteUpdated?: () => void;
}

export default function DynamicLeadFactoryPage({
  sites,
  currentSiteId,
  onLeadCreated,
  onSiteUpdated
}: DynamicLeadFactoryPageProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(currentSiteId || (sites[0]?.id || ''));
  const [activeSite, setActiveSite] = useState<Site | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [source, setSource] = useState<string>('organic_seo');
  
  // Dynamic form state
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [prospectName, setProspectName] = useState('');
  const [prospectPhone, setProspectPhone] = useState('');
  const [prospectEmail, setProspectEmail] = useState('');
  const [prospectCity, setProspectCity] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [consentCIL, setConsentCIL] = useState(true);
  const [consentPartner, setConsentPartner] = useState(true);
  
  // Submission & Result state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<Lead | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Configurator mode for operators
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSuccessMessage, setConfigSuccessMessage] = useState<string | null>(null);

  // Editable config state
  const [editBrandName, setEditBrandName] = useState('');
  const [editSlogan, setEditSlogan] = useState('');
  const [editCustomTitle, setEditCustomTitle] = useState('');
  const [editCtaText, setEditCtaText] = useState('');
  const [editTone, setEditTone] = useState('');
  const [editPrimaryColor, setEditPrimaryColor] = useState('#059669');
  const [editQuestions, setEditQuestions] = useState<QualificationQuestion[]>([]);

  // Load site details and config
  useEffect(() => {
    if (currentSiteId) {
      setSelectedSiteId(currentSiteId);
    }
  }, [currentSiteId]);

  useEffect(() => {
    const site = sites.find(s => s.id === selectedSiteId) || sites[0] || null;
    setActiveSite(site);
    
    if (site) {
      setProspectCity(site.city || 'Bobo-Dioulasso');
      setEditBrandName(site.brandedConfig?.brandName || site.title);
      setEditSlogan(site.brandedConfig?.slogan || site.subheadline);
      setEditCustomTitle(site.brandedConfig?.customTitle || site.title);
      setEditCtaText(site.brandedConfig?.ctaText || 'Demander un devis gratuit');
      setEditTone(site.brandedConfig?.tone || 'Professionnel et réactif');
      setEditPrimaryColor(site.brandedConfig?.primaryColor || '#059669');
      setEditQuestions(site.brandedConfig?.questions || []);
      setSubmissionResult(null);
      setErrorMessage(null);
      setAnswers({});

      // Fetch site campaigns
      fetch(`/api/sites/${site.id}/lead-factory`)
        .then(res => res.json())
        .then(data => {
          if (data.campaigns) {
            setCampaigns(data.campaigns);
            if (data.defaultCampaignId) {
              setSelectedCampaignId(data.defaultCampaignId);
            } else if (data.campaigns.length > 0) {
              setSelectedCampaignId(data.campaigns[0].id);
            }
          }
          if (data.brandedConfig?.questions) {
            setEditQuestions(data.brandedConfig.questions);
          }
        })
        .catch(err => console.error("Failed to load Lead Factory config:", err));
    }
  }, [selectedSiteId, sites]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSite) return;

    if (!consentCIL || !consentPartner) {
      setErrorMessage("Veuillez accepter les mentions de consentement obligatoires (CIL et partenaires).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSubmissionResult(null);

    // Build structured qualification text
    const questions = editQuestions.length > 0 ? editQuestions : [];
    const formattedAnswers = questions.map(q => {
      const ans = answers[q.id];
      const answerStr = Array.isArray(ans) ? ans.join(', ') : (ans || 'Non spécifié');
      return `[${q.label}]: ${answerStr}`;
    }).join(' | ');

    const fullRawMessage = `${formattedAnswers}${additionalNotes ? ` | Note client: ${additionalNotes}` : ''}`;

    try {
      const response = await fetch('/api/leads/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: activeSite.id,
          campaignId: selectedCampaignId || undefined,
          source,
          landingPage: `https://${activeSite.domain}/lead-factory`,
          formType: 'interactive_diagnostic',
          name: prospectName,
          phone: prospectPhone,
          email: prospectEmail || undefined,
          city: prospectCity,
          rawMessage: fullRawMessage,
          consentCILChecked: consentCIL,
          consentPartnerChecked: consentPartner
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec de l'ingestion du lead");
      }

      setSubmissionResult(data.lead);
      if (onLeadCreated) {
        onLeadCreated(data.lead);
      }
      if (onSiteUpdated) {
        onSiteUpdated();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Une erreur est survenue lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!activeSite) return;
    setIsSavingConfig(true);
    setConfigSuccessMessage(null);

    try {
      const response = await fetch(`/api/sites/${activeSite.id}/lead-factory`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: editBrandName,
          slogan: editSlogan,
          customTitle: editCustomTitle,
          ctaText: editCtaText,
          tone: editTone,
          primaryColor: editPrimaryColor,
          questions: editQuestions,
          defaultCampaignId: selectedCampaignId || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Échec de sauvegarde");
      }

      setConfigSuccessMessage("Configuration Lead Factory persistée avec succès dans Neon PostgreSQL !");
      if (onSiteUpdated) {
        onSiteUpdated();
      }
      setTimeout(() => setConfigSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de la sauvegarde de la configuration");
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleAddQuestion = () => {
    const newQ: QualificationQuestion = {
      id: `q_${Date.now()}`,
      label: "Nouvelle question de qualification",
      type: "select",
      required: true,
      options: ["Option A", "Option B", "Option C"]
    };
    setEditQuestions(prev => [...prev, newQ]);
  };

  const handleUpdateQuestion = (index: number, updates: Partial<QualificationQuestion>) => {
    setEditQuestions(prev => {
      const clone = [...prev];
      clone[index] = { ...clone[index], ...updates };
      return clone;
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setEditQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'solaire': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'formation': return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      case 'immobilier': return <Building className="w-5 h-5 text-emerald-500" />;
      case 'forage': return <Droplets className="w-5 h-5 text-sky-500" />;
      case 'agriculture': return <Leaf className="w-5 h-5 text-lime-500" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  if (!activeSite) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Aucun site autonome disponible. Veuillez d'abord créer un site.</p>
      </div>
    );
  }

  const currentQuestions = editQuestions.length > 0 ? editQuestions : [];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header & Site Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                P0.5 — Sites Autonomes
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Isolation Stricte
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              Page Lead Factory Dynamique par Site Autonome
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Chaque site spécialisé dispose de son propre parcours de qualification, de son identité de marque et de ses questions métier, tout en partageant le même moteur d'ingestion central Lead Factory Africa AI.
            </p>
          </div>

          {/* Site Selector Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-xs font-semibold text-slate-500 mr-1">Site actif :</label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {sites.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.theme} — {s.city})
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isConfigOpen 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              {isConfigOpen ? 'Masquer Configurateur' : 'Personnaliser Questions & Marque'}
            </button>
          </div>
        </div>

        {/* Site Details Pill Strip */}
        <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            {getThemeIcon(activeSite.theme)}
            <span className="font-bold text-slate-800">{activeSite.title}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div>Domaine : <span className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded">{activeSite.domain}</span></div>
          <span className="text-slate-300">•</span>
          <div>Secteur : <span className="capitalize font-semibold text-slate-800">{activeSite.theme}</span></div>
          <span className="text-slate-300">•</span>
          <div>Ville : <span className="font-semibold text-slate-800">{activeSite.city}</span></div>
          <span className="text-slate-300">•</span>
          <div>Statut : <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${activeSite.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{activeSite.status.toUpperCase()}</span></div>
        </div>
      </div>

      {/* Operator Configurator Panel (if open) */}
      {isConfigOpen && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-800 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              <h3 className="font-display font-bold text-base text-white">
                Configurateur de Qualification Lead Factory ({activeSite.title})
              </h3>
            </div>
            <button
              onClick={handleSaveConfig}
              disabled={isSavingConfig}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              {isSavingConfig ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Enregistrer dans PostgreSQL
            </button>
          </div>

          {configSuccessMessage && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {configSuccessMessage}
            </div>
          )}

          {/* Config Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Nom de Marque Affiché</label>
              <input
                type="text"
                value={editBrandName}
                onChange={(e) => setEditBrandName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Titre Personnalisé Formulaire</label>
              <input
                type="text"
                value={editCustomTitle}
                onChange={(e) => setEditCustomTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Texte du Bouton d'Action (CTA)</label>
              <input
                type="text"
                value={editCtaText}
                onChange={(e) => setEditCtaText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Slogan / Description d'Accroche</label>
              <input
                type="text"
                value={editSlogan}
                onChange={(e) => setEditSlogan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Ton & Persona IA</label>
              <input
                type="text"
                value={editTone}
                onChange={(e) => setEditTone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Couleur Principale</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editPrimaryColor}
                  onChange={(e) => setEditPrimaryColor(e.target.value)}
                  className="w-10 h-8 bg-transparent rounded cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-300">{editPrimaryColor}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Questions Builder */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <h4 className="font-semibold text-xs text-slate-300 uppercase tracking-wider">
                Questions de Qualification Spécifiques ({editQuestions.length})
              </h4>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter une question
              </button>
            </div>

            <div className="space-y-3">
              {editQuestions.map((q, idx) => (
                <div key={q.id || idx} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-mono font-bold text-slate-400">Q{idx + 1}.</span>
                      <input
                        type="text"
                        value={q.label}
                        onChange={(e) => handleUpdateQuestion(idx, { label: e.target.value })}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-400"
                        placeholder="Intitulé de la question..."
                      />
                    </div>
                    <select
                      value={q.type}
                      onChange={(e) => handleUpdateQuestion(idx, { type: e.target.value as any })}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                    >
                      <option value="select">Menu déroulant (Select)</option>
                      <option value="radio">Boutons Radio</option>
                      <option value="text">Texte Court</option>
                      <option value="textarea">Texte Long (Textarea)</option>
                      <option value="number">Nombre</option>
                      <option value="location">Localisation / Ville</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                      title="Supprimer la question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {(q.type === 'select' || q.type === 'radio') && (
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Options (séparées par une virgule) :</label>
                      <input
                        type="text"
                        value={(q.options || []).join(', ')}
                        onChange={(e) => handleUpdateQuestion(idx, { 
                          options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                        })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-400"
                        placeholder="Option 1, Option 2, Option 3..."
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Form & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Dynamic Form for the Site */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
            
            {/* Branding Header */}
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                  style={{ backgroundColor: editPrimaryColor }}
                >
                  {getThemeIcon(activeSite.theme)}
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-slate-900">
                    {editCustomTitle || activeSite.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editSlogan || activeSite.subheadline}
                  </p>
                </div>
              </div>
            </div>

            {/* Campaign & Acquisition Context Selector (For operator testing) */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Contexte d'Acquisition (Multi-Site Isolation) :
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Campagne rattachée :</label>
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                  >
                    <option value="">Aucune campagne (Trafic direct / Organique)</option>
                    {campaigns.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.targetSegment})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Canal / Source :</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                  >
                    <option value="organic_seo">SEO Organique (Google)</option>
                    <option value="facebook">Facebook Ads / Page</option>
                    <option value="whatsapp">WhatsApp Direct / Message</option>
                    <option value="qr_code">QR Code (Flyer / Événement)</option>
                    <option value="radio">Spot Radio Locale</option>
                    <option value="google_ads">Google Ads (Futur P0.6)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* The Dynamic Qualification Form */}
            <form onSubmit={handleFormSubmit} className="space-y-5">
              
              {/* Dynamic Questions Render */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  1. Questions de Qualification ({activeSite.theme.toUpperCase()})
                </div>

                {currentQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      {q.label} {q.required && <span className="text-rose-500">*</span>}
                    </label>

                    {q.type === 'select' && (
                      <select
                        required={q.required}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="">Sélectionnez une option...</option>
                        {(q.options || []).map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {q.type === 'radio' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {(q.options || []).map((opt, oIdx) => (
                          <label 
                            key={oIdx}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              answers[q.id] === opt 
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold' 
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={answers[q.id] === opt}
                              onChange={() => handleAnswerChange(q.id, opt)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {(q.type === 'text' || q.type === 'location') && (
                      <input
                        type="text"
                        required={q.required}
                        placeholder={q.placeholder || "Votre réponse..."}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    )}

                    {q.type === 'textarea' && (
                      <textarea
                        required={q.required}
                        rows={2}
                        placeholder={q.placeholder || "Précisez votre demande..."}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Prospect Details */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Coordonnées de Contact du Prospect
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Ousmane Traoré"
                      value={prospectName}
                      onChange={(e) => setProspectName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone direct *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +226 70 12 34 56"
                      value={prospectPhone}
                      onChange={(e) => setProspectPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email (optionnel)</label>
                    <input
                      type="email"
                      placeholder="Ex: ousmane@gmail.com"
                      value={prospectEmail}
                      onChange={(e) => setProspectEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ville de résidence</label>
                    <input
                      type="text"
                      value={prospectCity}
                      onChange={(e) => setProspectCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Consent CIL & Partner (P0.3.1 Compliance) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentCIL}
                    onChange={(e) => setConsentCIL(e.target.checked)}
                    className="mt-0.5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span>
                    J'accepte le traitement de mes données conformément à la Loi N°001-2021/AN du Burkina Faso (CIL).
                  </span>
                </label>

                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentPartner}
                    onChange={(e) => setConsentPartner(e.target.checked)}
                    className="mt-0.5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span>
                    J'autorise Lead Factory Africa à transmettre ma demande aux entreprises certifiées partenaires de {activeSite.city}.
                  </span>
                </label>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: editPrimaryColor }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Qualification cognitive Gemini en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {editCtaText || "Transmettre ma demande"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Live Qualification Result & Pipeline Inspector */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Submission Feedback Card */}
          {submissionResult ? (
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 pb-3 border-b border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-display font-bold text-sm text-emerald-900">
                    Lead Qualifié & Enregistré avec Succès
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    ID : <span className="font-mono">{submissionResult.id}</span>
                  </p>
                </div>
              </div>

              {/* Scoring & Needs Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Score de Qualité</span>
                  <span className="text-lg font-bold text-slate-800">{submissionResult.score}/100</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Statut d'Attribution</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-1 ${
                    submissionResult.assignedPartnerId 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {submissionResult.assignedPartnerId ? 'ATTRIBUÉ (P0.4)' : 'WAITING_FOR_PARTNER'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Besoin Résumé (IA Gemini)</span>
                  <p className="font-medium text-slate-800">{submissionResult.summarizedNeed}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Budget</span>
                    <span className="font-semibold text-slate-800">{submissionResult.budget}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Urgence</span>
                    <span className="font-semibold text-slate-800">{submissionResult.urgency}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Proposition de Réponse</span>
                  <p className="text-[11px] text-slate-600 whitespace-pre-line italic">
                    "{submissionResult.responseDraft}"
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Site d'Origine : <strong>{submissionResult.siteTitle}</strong></span>
                <span>Canal : <strong>{submissionResult.source}</strong></span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-800">
                Prêt pour la Qualification Cognitive
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Remplissez les questions de qualification ci-contre pour tester le parcours prospect, le scoring Gemini et la distribution automatique P0.4.
              </p>
            </div>
          )}

          {/* Architecture Isolation Summary Box */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs text-slate-600">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Garanties d'Isolation Multi-Sites (P0.5)
            </h5>
            <ul className="space-y-1.5 list-disc list-inside text-[11px] text-slate-600">
              <li><strong>Site Contextualization :</strong> Les prompts Gemini ne reçoivent que les questions et données du site <span className="font-semibold text-slate-800">{activeSite.title}</span>.</li>
              <li><strong>Campaign Integrity :</strong> Rejet automatique si une campagne n'appartient pas au site.</li>
              <li><strong>Centralized Pipeline :</strong> Les leads convergent vers la table unifiée Neon PostgreSQL avec indexation par <span className="font-mono text-slate-700">site_id</span>.</li>
              <li><strong>Zero Additional Cost :</strong> Exécution 100% serverless sur l'infrastructure existante (0 FCFA).</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
