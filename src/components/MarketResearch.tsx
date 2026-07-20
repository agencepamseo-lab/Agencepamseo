import React, { useState } from 'react';
import { MarketTrend } from '../types';
import { 
  TrendingUp, Globe, Search, ArrowRight, Sparkles, 
  Loader2, Lightbulb, MapPin, Target, BarChart2
} from 'lucide-react';

interface MarketResearchProps {
  trends: MarketTrend[];
  onTriggerSiteGeneration: (sector: string, keyword: string) => void;
}

export default function MarketResearch({ trends, onTriggerSiteGeneration }: MarketResearchProps) {
  const [city, setCity] = useState('Bobo-Dioulasso');
  const [sector, setSector] = useState('Tous');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    opportunities: MarketTrend[];
    aiAnalysis: string;
  } | null>(null);

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, sector })
      });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Market analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Title & Concept summary */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Agent IA Market Research</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight mb-3">
            Moteur d'Intelligence Marché & Opportunités IA
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            LeadFactory Africa AI écoute le web burkinabè. Notre intelligence artificielle analyse les requêtes Google, les questions fréquentes des réseaux sociaux et les pénuries locales à <strong>Bobo-Dioulasso</strong> pour identifier où se cachent les demandes d'achat non satisfaites.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      {/* Dynamic IA Analysis Trigger Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-slate-800 font-display font-bold text-base mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-500" />
          Lancer une analyse de marché local par l'IA
        </h3>
        <form onSubmit={handleRunAnalysis} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Ville du Burkina Faso</label>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-800 transition text-slate-700"
            >
              <option value="Bobo-Dioulasso">Bobo-Dioulasso (Hauts-Bassins)</option>
              <option value="Ouagadougou">Ouagadougou (Centre)</option>
              <option value="Koudougou">Koudougou (Centre-Ouest)</option>
              <option value="Banfora">Banfora (Cascades)</option>
              <option value="Gaoua">Gaoua (Sud-Ouest)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Secteur Prioritaire</label>
            <select 
              value={sector} 
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-800 transition text-slate-700"
            >
              <option value="Tous">Tous les secteurs</option>
              <option value="solaire">Énergie Solaire & Électricité</option>
              <option value="formation">Formations & Académies</option>
              <option value="immobilier">Immobilier & Foncier</option>
              <option value="forage">Forage d'eau & Hydraulique</option>
              <option value="agriculture">Agriculture & Élevage</option>
            </select>
          </div>
          <div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Analyser les opportunités</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Dynamic Result Panel */}
      {analysisResult && (
        <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6 space-y-6">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg shrink-0 mt-0.5">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 text-base">Rapport Stratégique IA - {city}</h4>
              <p className="text-slate-600 text-xs leading-relaxed mt-1">{analysisResult.aiAnalysis}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analysisResult.opportunities.map((opp, i) => (
              <div key={i} className="bg-white rounded-xl border border-indigo-100 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono font-bold uppercase">
                      {opp.sector}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 font-mono">
                      {opp.growth} Croissance
                    </span>
                  </div>
                  <h5 className="font-display font-bold text-slate-800 text-sm mb-2">
                    "{opp.keyword}"
                  </h5>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">
                    {opp.description}
                  </p>
                </div>
                <div className="border-t border-slate-50 pt-3">
                  <p className="text-[11px] text-slate-500 italic mb-3">
                    <strong>Opportunité :</strong> {opp.opportunity}
                  </p>
                  <button 
                    onClick={() => onTriggerSiteGeneration(opp.sector, opp.keyword)}
                    className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Générer un microsite</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Default/Pre-seeded Local Trends Visualized */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-slate-700" />
          <h3 className="text-slate-800 font-display font-bold text-base">Opportunités du Marché Détectées à Bobo-Dioulasso</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trends.map((trend) => (
            <div 
              key={trend.id} 
              className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-sm"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500">Bobo-Dioulasso</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded">
                    {trend.sector.toUpperCase()}
                  </span>
                </div>
                
                <h4 className="font-display font-bold text-slate-800 text-sm leading-snug mb-2">
                  Recherche : "{trend.keyword}"
                </h4>
                
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg my-3 text-center">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-mono">Volume</span>
                    <span className="text-xs font-bold text-slate-700">{trend.volume}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-mono">Croissance</span>
                    <span className="text-xs font-bold text-emerald-600">{trend.growth}</span>
                  </div>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  {trend.description}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-normal">
                  <span className="font-bold text-slate-700">Filtre IA :</span> {trend.opportunity}
                </p>
                <button 
                  onClick={() => onTriggerSiteGeneration(trend.sector, trend.keyword)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>Générer un microsite d'acquisition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
