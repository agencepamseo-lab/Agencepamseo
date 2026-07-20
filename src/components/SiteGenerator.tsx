import React, { useState, useEffect } from 'react';
import { Site } from '../types';
import { 
  Sparkles, Loader2, Play, Globe, Check, Edit3, 
  HelpCircle, Settings, Plus, LayoutGrid, Info
} from 'lucide-react';

interface SiteGeneratorProps {
  onSiteCreated: (newSite: Site) => void;
  prefilledSector: string;
  prefilledKeyword: string;
  onClearPrefills: () => void;
}

export default function SiteGenerator({ onSiteCreated, prefilledSector, prefilledKeyword, onClearPrefills }: SiteGeneratorProps) {
  const [theme, setTheme] = useState<'solaire' | 'formation' | 'immobilier' | 'agriculture' | 'forage'>('solaire');
  const [city, setCity] = useState('Bobo-Dioulasso');
  const [customKeyword, setCustomKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCILCompliant, setIsCILCompliant] = useState(true);

  // Draft generated site state
  const [draftSite, setDraftSite] = useState<{
    title: string;
    domain: string;
    headline: string;
    subheadline: string;
    features: string[];
    chatbotGreeting: string;
    chatbotPersona: string;
    faqs: { question: string; answer: string }[];
  } | null>(null);

  // Sync pre-fills from the MarketIntelligence tab
  useEffect(() => {
    if (prefilledSector) {
      const mappedTheme = prefilledSector.toLowerCase() as any;
      if (['solaire', 'formation', 'immobilier', 'agriculture', 'forage'].includes(mappedTheme)) {
        setTheme(mappedTheme);
      }
    }
    if (prefilledKeyword) {
      setCustomKeyword(prefilledKeyword);
    }
  }, [prefilledSector, prefilledKeyword]);

  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDraftSite(null);

    try {
      const response = await fetch('/api/generate-site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          city,
          customSector: customKeyword
        })
      });
      const data = await response.json();
      setDraftSite(data);
    } catch (error) {
      console.error('Failed to generate site content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploySite = async () => {
    if (!draftSite) return;

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draftSite,
          theme,
          city,
          status: 'active',
          isCILCompliant
        })
      });
      const newSite = await response.json();
      onSiteCreated(newSite);
      
      // Reset draft and pre-fills
      setDraftSite(null);
      setCustomKeyword('');
      setIsCILCompliant(true);
      onClearPrefills();
      
      alert(`Félicitations ! Le microsite "${newSite.title}" a été déployé avec succès sur le domaine ${newSite.domain} !`);
    } catch (error) {
      console.error('Deployment failed:', error);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Description header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-display font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Sparkles className="w-5.5 h-5.5 text-indigo-500" />
          Générateur de Microsites d'Acquisition par l'IA
        </h2>
        <p className="text-slate-500 text-xs leading-relaxed max-w-3xl">
          Déployez instantanément un canal d'acquisition thématique optimisé pour le SEO local du Burkina Faso. L'IA rédige de manière autonome le design textuel, les accroches de conversion et configure un chatbot intelligent entraîné pour conseiller les prospects de {city}.
        </p>
      </div>

      {/* Inputs layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Configuration Panel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 self-start">
          <h3 className="text-slate-800 font-display font-bold text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-500" />
            1. Paramètres du Microsite
          </h3>

          <form onSubmit={handleGenerateDraft} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Métier / Modèle Thématique</label>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-800 transition text-slate-700 font-medium"
              >
                <option value="solaire">☀️ Énergie Solaire (Kits, Pompage)</option>
                <option value="formation">🎓 Formation Professionnelle & IA</option>
                <option value="immobilier">🏢 Immobilier (Terrains, Logements)</option>
                <option value="agriculture">🐔 Agriculture (Poulaillers, Couveuses)</option>
                <option value="forage">💧 Forage d'Eau & Hydraulique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Zone Géographique de Capture</label>
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-800 transition text-slate-700 font-medium"
              >
                <option value="Bobo-Dioulasso">Bobo-Dioulasso (Hauts-Bassins)</option>
                <option value="Ouagadougou">Ouagadougou (Centre)</option>
                <option value="Koudougou">Koudougou (Centre-Ouest)</option>
                <option value="Banfora">Banfora (Cascades)</option>
                <option value="Gaoua">Gaoua (Sud-Ouest)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Spécificité / Mots-clés IA (Optionnel)
              </label>
              <input 
                type="text"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                placeholder="Ex: kits de pompage solaire, cours du soir"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-800 transition text-slate-700"
              />
              {prefilledKeyword && (
                <div className="mt-2 bg-indigo-50 border border-indigo-100 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-[10px] text-indigo-700 font-medium">Pré-rempli depuis Market Research</span>
                  <button 
                    type="button" 
                    onClick={onClearPrefills} 
                    className="text-[10px] text-indigo-500 hover:text-indigo-800 underline"
                  >
                    Effacer
                  </button>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  <span>Génération par l'IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Rédiger le contenu par l'IA</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right column: Form draft and live editing */}
        <div className="lg:col-span-2 space-y-6">
          
          {!draftSite && !isLoading && (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center h-full">
              <LayoutGrid className="w-12 h-12 text-slate-300 mb-3" />
              <h4 className="font-display font-bold text-slate-700 text-sm mb-1">Aucun brouillon de microsite</h4>
              <p className="text-slate-400 text-xs max-w-sm">
                Sélectionnez vos critères dans le panneau de gauche puis cliquez sur "Rédiger" pour laisser l'IA générer le contenu de conversion localisé.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <div className="space-y-1">
                <h4 className="font-display font-bold text-slate-800 text-sm">Génération autonome en cours...</h4>
                <p className="text-slate-400 text-xs">
                  L'Agent Website Builder rédige des titres accrocheurs et l'Agent SEO sélectionne les mots-clés optimaux pour {city}.
                </p>
              </div>
            </div>
          )}

          {draftSite && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-slate-800 font-display font-bold text-sm">
                    2. Valider et éditer le contenu rédigé par l'IA
                  </h3>
                </div>
                <button 
                  onClick={handleDeploySite}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Déployer le Microsite</span>
                </button>
              </div>

              {/* Editable Fields */}
              <div className="bg-slate-50 border border-slate-200/65 rounded-xl p-4 flex items-start gap-3">
                <input 
                  type="checkbox"
                  id="generator-cil-compliance"
                  checked={isCILCompliant}
                  onChange={(e) => setIsCILCompliant(e.target.checked)}
                  className="mt-1 h-4 w-4 text-indigo-600 border-slate-300 rounded-sm focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="generator-cil-compliance" className="block text-xs font-bold text-slate-800 cursor-pointer">
                    Injecter les clauses de consentement CIL Burkina Faso
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Ajoute automatiquement les cases de consentement explicite d'utilisation des données personnelles et d'accès aux droits de suppression selon la loi nationale.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nom commercial du site</label>
                  <input 
                    type="text" 
                    value={draftSite.title}
                    onChange={(e) => setDraftSite({ ...draftSite, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Sous-domaine réservé</label>
                  <input 
                    type="text" 
                    value={draftSite.domain}
                    onChange={(e) => setDraftSite({ ...draftSite, domain: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Titre principal (Headline)</label>
                <input 
                  type="text" 
                  value={draftSite.headline}
                  onChange={(e) => setDraftSite({ ...draftSite, headline: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Sous-titre d'appel à l'action</label>
                <textarea 
                  rows={2}
                  value={draftSite.subheadline}
                  onChange={(e) => setDraftSite({ ...draftSite, subheadline: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition resize-none"
                />
              </div>

              {/* Features Editing */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-slate-700">Arguments de conversion (3 Points Forts)</label>
                {draftSite.features.map((feat, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <input 
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const newFeatures = [...draftSite.features];
                        newFeatures[idx] = e.target.value;
                        setDraftSite({ ...draftSite, features: newFeatures });
                      }}
                      className="flex-1 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                ))}
              </div>

              {/* Chatbot Config */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-slate-700">Greeting Chatbot (Message d'Accueil)</label>
                  <textarea 
                    rows={3}
                    value={draftSite.chatbotGreeting}
                    onChange={(e) => setDraftSite({ ...draftSite, chatbotGreeting: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition resize-none"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-slate-700">Personnalité / Système IA du Chatbot</label>
                  <textarea 
                    rows={3}
                    value={draftSite.chatbotPersona}
                    onChange={(e) => setDraftSite({ ...draftSite, chatbotPersona: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition resize-none"
                  />
                </div>
              </div>

              {/* FAQs Draft */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  Questions Fréquentes (FAQs) du microsite
                </label>
                {draftSite.faqs.map((faq, idx) => (
                  <div key={idx} className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <input 
                      type="text"
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...draftSite.faqs];
                        newFaqs[idx].question = e.target.value;
                        setDraftSite({ ...draftSite, faqs: newFaqs });
                      }}
                      className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                    <textarea 
                      placeholder="Réponse"
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...draftSite.faqs];
                        newFaqs[idx].answer = e.target.value;
                        setDraftSite({ ...draftSite, faqs: newFaqs });
                      }}
                      className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
