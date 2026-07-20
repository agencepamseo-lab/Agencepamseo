import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, FileCheck2, Library, CheckCircle2, 
  HelpCircle, RefreshCw, Send, Lock, Eye, Check, AlertOctagon 
} from 'lucide-react';

interface AgentComplianceProps {
  sitesCount: number;
  compliantSitesCount: number;
}

export default function AgentCompliance({ sitesCount, compliantSitesCount }: AgentComplianceProps) {
  // Campaign Audit States
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignSlogan, setCampaignSlogan] = useState('');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    isCompliant: boolean;
    rating: number;
    recommendations: string[];
  } | null>(null);

  // General audit checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Case à cocher active et non-précochée pour la CIL Burkina", checked: true },
    { id: 2, text: "Lien clair vers la politique de confidentialité locale", checked: true },
    { id: 3, text: "Mention légale du rôle de co-traitant de LeadFactory", checked: true },
    { id: 4, text: "Mise à disposition d'une adresse email de réclamation/retrait", checked: false },
    { id: 5, text: "Formulaires de contact chiffrés via protocole SSL", checked: true },
    { id: 6, text: "Information claire sur la destination des données", checked: false }
  ]);

  const handleToggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSlogan.trim()) return;

    setIsAuditing(true);
    setAuditResult(null);

    try {
      const response = await fetch('/api/compliance/audit-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: campaignTitle || "Campagne d'acquisition",
          slogan: campaignSlogan,
          description: campaignDesc
        })
      });
      const data = await response.json();
      setAuditResult(data);
    } catch (error) {
      console.error("Audit failed:", error);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Banner introduction with Agent Compliance branding */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-display font-extrabold text-white">Agent Compliance Africa AI</h2>
          </div>
          <p className="text-slate-400 text-xs mt-1.5 max-w-xl">
            Ce module supervise la conformité légale des canaux d'acquisition et des collectes de données vis-à-vis de la CIL (Commission de l'Informatique et des Libertés) du Burkina Faso.
          </p>
        </div>
        
        {/* Quick statistics */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex gap-4 text-xs font-semibold">
          <div>
            <span className="block text-[9px] text-slate-500 font-mono uppercase">Sites Audités</span>
            <span className="text-white text-sm font-bold">{sitesCount}</span>
          </div>
          <div className="w-[1px] bg-slate-800 h-8"></div>
          <div>
            <span className="block text-[9px] text-slate-500 font-mono uppercase">Taux Conformité</span>
            <span className="text-emerald-400 text-sm font-bold">
              {sitesCount > 0 ? Math.round((compliantSitesCount / sitesCount) * 100) : 100}%
            </span>
          </div>
        </div>
      </div>

      {/* Main split: Slogan Auditor and Regulatory watch checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Campaign slogan/copy compliance auditor */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-slate-800 font-display font-bold text-sm flex items-center gap-1.5">
              <FileCheck2 className="w-4.5 h-4.5 text-indigo-500" />
              Audit de conformité des slogans de campagne
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              L'IA analyse vos accroches pour détecter les promesses trompeuses, déceptives ou non-conformes à la réglementation du commerce électronique.
            </p>
          </div>

          <form onSubmit={handleRunAudit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Titre de l'offre commerciale</label>
              <input 
                type="text"
                placeholder="Ex: Énergie Solaire d'Afrique"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Accroche / Slogan à auditer *</label>
              <input 
                type="text"
                required
                placeholder="Ex: Électricité gratuite 100% à vie sans payer aucune facture !"
                value={campaignSlogan}
                onChange={(e) => setCampaignSlogan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description courte de la campagne</label>
              <textarea 
                rows={2}
                placeholder="Ex: Nous installons des panneaux solaires de qualité chez les particuliers à Bobo-Dioulasso..."
                value={campaignDesc}
                onChange={(e) => setCampaignDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={isAuditing}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />
                  <span>Audit de conformité IA...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lancer l'Audit Compliance IA</span>
                </>
              )}
            </button>
          </form>

          {/* Audit Results display */}
          {auditResult && (
            <div className={`rounded-xl p-4 border text-xs space-y-3 transition-all ${
              auditResult.isCompliant 
                ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' 
                : 'bg-rose-50/50 border-rose-200 text-slate-800'
            }`}>
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                <span className="font-mono font-bold uppercase flex items-center gap-1">
                  {auditResult.isCompliant ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-rose-500" />
                  )}
                  {auditResult.isCompliant ? "Campagne Conforme CIL" : "ALERTE NON-CONFORMITÉ"}
                </span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  auditResult.rating >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  Score: {auditResult.rating}/100
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="font-semibold text-slate-700">Recommandations de l'Agent Compliance :</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 leading-relaxed">
                  {auditResult.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* CIL Regulatory Checklist & Regulatory Watch */}
        <div className="space-y-6">
          
          {/* Active Checklist */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
            <h3 className="text-slate-800 font-display font-bold text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Library className="w-4.5 h-4.5 text-indigo-500" />
              Checklist réglementaire CIL obligatoire (Burkina Faso)
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              En tant que responsable de traitement de données à Bobo-Dioulasso, assurez-vous de cocher chaque case avant toute mise en ligne :
            </p>

            <div className="space-y-2.5">
              {checklist.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => handleToggleChecklist(item.id)}
                  className="flex items-start gap-3 p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/60 rounded-xl transition cursor-pointer select-none"
                >
                  <div className={`mt-0.5 w-4.5 h-4.5 rounded-sm border flex items-center justify-center shrink-0 transition ${
                    item.checked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                  }`}>
                    {item.checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[11px] text-slate-700 font-medium leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CIL Regulatory Watch Alert Box */}
          <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
              <span>Cellule de veille juridique & CIL</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>Mise à jour Juillet 2026 :</strong> Le renforcement des contrôles de la CIL à l'Ouest (Houet, Bobo-Dioulasso) impose d'indiquer explicitement les coordonnées du délégué à la protection des données ou du responsable local d'acquisition sur chaque microsite hébergé en <code>.leadfactory.africa</code>.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
