import React, { useState } from 'react';
import { Lead, Partner } from '../types';
import { 
  Building2, Briefcase, Mail, Phone, MapPin, CheckCircle, 
  Copy, Check, Clock, ShieldAlert, Award, FileText, ArrowRight,
  TrendingUp, CircleDollarSign, LogIn, ChevronRight, UserCheck
} from 'lucide-react';

interface PartnerWorkspaceProps {
  leads: Lead[];
  partners: Partner[];
  onUpdateLead: (leadId: string, updates: { status?: Lead['status']; assignedPartnerId?: string | null }) => void;
}

export default function PartnerWorkspace({ leads, partners, onUpdateLead }: PartnerWorkspaceProps) {
  const [activePartnerId, setActivePartnerId] = useState<string>(partners[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activePartner = partners.find(p => p.id === activePartnerId) || partners[0];

  // Filter leads matched to this specific partner
  const partnerLeads = leads.filter(l => l.assignedPartnerId === activePartnerId);

  // Stats for this partner
  const totalReceived = partnerLeads.length;
  const contactedCount = partnerLeads.filter(l => l.status === 'contacted').length;
  const soldCount = partnerLeads.filter(l => l.status === 'sold').length;
  const conversionRate = totalReceived > 0 ? Math.round((soldCount / totalReceived) * 100) : 0;

  const handleCopyDraft = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Nouveau Prospect</span>;
      case 'contacted':
        return <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Contacté / En cours</span>;
      case 'sold':
        return <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Opportunité Gagnée</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Classé sans suite</span>;
    }
  };

  const formatCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 })
      .format(amount)
      .replace('XOF', 'FCFA');
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Simulation Partner Login Portal Top Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <LogIn className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-slate-800 font-display font-bold text-sm">Simulateur d'Espace Client Partenaire</h3>
            <p className="text-slate-500 text-xs">Sélectionnez l'entreprise burkinabè pour afficher son tableau de bord de prospects reçus.</p>
          </div>
        </div>

        <select 
          value={activePartnerId}
          onChange={(e) => setActivePartnerId(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden"
        >
          {partners.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.sector})</option>
          ))}
        </select>
      </div>

      {activePartner ? (
        <div className="space-y-6">
          
          {/* Partner Stats Banner */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-lg grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="border-b sm:border-b-0 sm:border-r border-slate-800 pb-4 sm:pb-0 sm:pr-4">
              <span className="block text-[10px] text-slate-400 font-mono">ENTREPRISE ACTUELLE</span>
              <h4 className="text-base font-display font-extrabold text-white mt-1">{activePartner.name}</h4>
              <p className="text-slate-400 text-xs mt-1 capitalize flex items-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-400" />
                {activePartner.city} • {activePartner.sector}
              </p>
            </div>

            <div className="border-b sm:border-b-0 sm:border-r border-slate-800 pb-4 sm:pb-0 sm:pr-4">
              <span className="block text-[10px] text-slate-400 font-mono">STATUT D'EXCLUSIVITÉ</span>
              <span className="text-base font-extrabold text-white block mt-1">
                {activePartner.subscriptionPlan === 'Premium' ? (
                  <span className="text-emerald-400 flex items-center gap-1 text-sm">👑 Exclusivité Totale</span>
                ) : activePartner.exclusiveAccess ? (
                  <span className="text-teal-400 flex items-center gap-1 text-sm">✨ Exclusivité Partielle</span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1 text-sm">🌱 Partage Standard</span>
                )}
              </span>
              <span className="text-slate-400 text-[10px] block mt-1">
                {activePartner.subscriptionPlan === 'Premium' 
                  ? 'Secteur Solaire / Formation protégé' 
                  : activePartner.exclusiveAccess 
                  ? 'Prospects réservés 48h' 
                  : 'Distribué à la concurrence'}
              </span>
            </div>

            <div className="border-b sm:border-b-0 sm:border-r border-slate-800 pb-4 sm:pb-0 sm:pr-4">
              <span className="block text-[10px] text-slate-400 font-mono">PLAN & QUOTA MENSUEL</span>
              <span className="text-lg font-extrabold text-white block mt-1">{activePartner.subscriptionPlan}</span>
              <span className="text-indigo-400 text-[10px]">Quota : {activePartner.leadsReceived} / {activePartner.maxLeadsPerMonth === 9999 ? 'Illimité' : activePartner.maxLeadsPerMonth} leads</span>
            </div>

            <div>
              <span className="block text-[10px] text-slate-400 font-mono">REVENUS CONVERTIS (SIMULÉS)</span>
              <span className="text-xl font-display font-extrabold text-emerald-400 block mt-1">{formatCFA(activePartner.revenueGenerated)}</span>
              <span className="text-slate-400 text-[10px]">Taux de conversion : {conversionRate}% ({totalReceived} leads reçus)</span>
            </div>
          </div>

          {/* Leads specific to partner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Leads list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h4 className="text-slate-800 font-display font-bold text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-indigo-500" />
                Liste de vos opportunités qualifiées ({totalReceived})
              </h4>

              {partnerLeads.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs italic space-y-2">
                  <UserCheck className="w-8 h-8 mx-auto text-slate-200" />
                  <p>Aucun prospect ne vous a encore été attribué de manière sémantique par l'IA.</p>
                  <p className="text-[10px] text-slate-300">Remplissez le formulaire de l'un de vos microsites pour générer une opportunité automatique !</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                  {partnerLeads.map((lead) => (
                    <div 
                      key={lead.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition space-y-3 relative group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-slate-800 text-xs">{lead.name}</h5>
                          <p className="text-slate-400 text-[10px] mt-0.5">{new Date(lead.createdAt).toLocaleDateString('fr-FR')} • {lead.city}</p>
                        </div>
                        <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                          lead.score >= 85 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-indigo-700 bg-indigo-50 border-indigo-100'
                        }`}>
                          Score: {lead.score}/100
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 line-clamp-2 italic">
                        "{lead.rawMessage}"
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100/60 text-xs">
                        {getStatusBadge(lead.status)}
                        
                        <div className="flex gap-1">
                          {lead.status !== 'contacted' && lead.status !== 'sold' && (
                            <button 
                              onClick={() => onUpdateLead(lead.id, { status: 'contacted' })}
                              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold transition cursor-pointer"
                            >
                              Marquer Contacté
                            </button>
                          )}
                          {lead.status !== 'sold' && (
                            <button 
                              onClick={() => onUpdateLead(lead.id, { status: 'sold' })}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition cursor-pointer"
                            >
                              Gagner Opportunité (+15k)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Selected partner outreach guidance */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h4 className="text-slate-800 font-display font-bold text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-indigo-500" />
                Protocole de rappel & Recommandations IA
              </h4>

              <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/40 space-y-3">
                  <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    Comment maximiser le taux de fermeture ?
                  </h5>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px]">
                    <li>Appeler le prospect dans les 15 minutes suivant sa soumission (score de chaleur maximal).</li>
                    <li>Ouvrir l'appel en mentionnant <strong>LeadFactory</strong> et le microsite thématique.</li>
                    <li>S'appuyer sur la qualification de l'IA (le budget estimé et le point de douleur).</li>
                    <li>Utiliser le projet de message d'outreach IA par WhatsApp avant d'appeler.</li>
                  </ol>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100/40">
                  <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1 mb-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Engagements qualité
                  </h5>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    En tant que partenaire certifié, vous vous engagez à recontacter chaque prospect de manière respectueuse et éthique, conformément aux lois burkinabè sur la protection des données personnelles.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="py-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-center font-mono text-xs text-slate-400">
          Enregistrez d'abord une entreprise partenaire pour afficher le portail d'attribution.
        </div>
      )}

    </div>
  );
}
