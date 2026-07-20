import React, { useState } from 'react';
import { Lead, Partner, ActivityLog } from '../types';
import { 
  Users, TrendingUp, CheckCircle, Clock, Copy, Search, Filter, 
  MapPin, ShieldAlert, Award, FileText, ChevronRight, Check, AlertCircle,
  Briefcase, MessageSquare, ArrowRight, UserCheck
} from 'lucide-react';

interface LeadsManagerProps {
  leads: Lead[];
  partners: Partner[];
  activityLogs: ActivityLog[];
  onUpdateLead: (leadId: string, updates: { status?: Lead['status']; assignedPartnerId?: string | null }) => void;
}

export default function LeadsManager({ leads, partners, activityLogs, onUpdateLead }: LeadsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  // Calculations
  const totalLeads = leads.length;
  const avgScore = totalLeads > 0 ? Math.round(leads.reduce((acc, l) => acc + l.score, 0) / totalLeads) : 0;
  const soldLeads = leads.filter(l => l.status === 'sold').length;
  const conversionRate = totalLeads > 0 ? Math.round((soldLeads / totalLeads) * 100) : 0;
  const newLeads = leads.filter(l => l.status === 'new').length;

  // Filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.rawMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyDraft = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] px-2 py-0.5 rounded-full font-semibold">Nouveau</span>;
      case 'contacted':
        return <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] px-2 py-0.5 rounded-full font-semibold">Contacté</span>;
      case 'sold':
        return <span className="bg-green-50 text-green-700 border border-green-100 text-[10px] px-2 py-0.5 rounded-full font-semibold">Vendu</span>;
      case 'rejected':
        return <span className="bg-red-50 text-red-700 border border-red-100 text-[10px] px-2 py-0.5 rounded-full font-semibold">Rejeté</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 70) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    return 'text-amber-600 bg-amber-50 border-amber-100';
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Prospects Totaux</span>
            <span className="text-xl font-display font-extrabold text-slate-800">{totalLeads}</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">{newLeads} en attente</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Qualité Score IA</span>
            <span className="text-xl font-display font-extrabold text-slate-800">{avgScore}/100</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Moyenne de qualification</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Taux de Vente</span>
            <span className="text-xl font-display font-extrabold text-slate-800">{conversionRate}%</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">{soldLeads} opportunités conclues</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Temps Moyen IA</span>
            <span className="text-xl font-display font-extrabold text-slate-800">1.8s</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Qualification & matching</span>
          </div>
        </div>

      </div>

      {/* Main CRM split workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table list column (Left) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          
          {/* Header & filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <h3 className="text-slate-800 font-display font-bold text-base">Base des opportunités réelles</h3>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-hidden"
              >
                <option value="all">Tous statuts</option>
                <option value="new">Nouveaux</option>
                <option value="contacted">Contactés</option>
                <option value="sold">Vendus</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
          </div>

          {/* Prospects list table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Prospect</th>
                  <th className="py-3 px-2">Canal d'origine</th>
                  <th className="py-3 px-2 text-center">Score IA</th>
                  <th className="py-3 px-2">Statut</th>
                  <th className="py-3 px-2">Partenaire affecté</th>
                  <th className="py-3 px-1 text-center">Urgence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const partner = partners.find(p => p.id === lead.assignedPartnerId);
                  const isSelected = selectedLead?.id === lead.id;

                  return (
                    <tr 
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition ${isSelected ? 'bg-indigo-50/40 font-medium' : ''}`}
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800">{lead.name}</div>
                        <div className="text-slate-400 text-[10px] mt-0.5">{lead.phone}</div>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="text-slate-500">{lead.siteTitle}</span>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-300" />
                          <span>{lead.city}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <span className={`inline-block font-mono font-bold text-[10px] px-2 py-0.5 rounded border ${getScoreColor(lead.score)}`}>
                          {lead.score}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-2">
                        {getStatusBadge(lead.status)}
                      </td>
                      <td className="py-3.5 px-2 text-slate-600">
                        {partner ? (
                          <span className="text-slate-700 font-semibold">{partner.name}</span>
                        ) : (
                          <span className="text-slate-400 italic">Non attribué</span>
                        )}
                      </td>
                      <td className="py-3.5 px-1 text-center">
                        <span className={`text-[10px] font-bold ${
                          lead.urgency === 'Élevé' ? 'text-red-600' : (lead.urgency === 'Moyen' ? 'text-amber-600' : 'text-slate-500')
                        }`}>
                          {lead.urgency}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                      Aucun prospect trouvé pour vos critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Detailed IA Qualification report column (Right) */}
        <div className="space-y-6">
          
          {selectedLead ? (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 text-white p-6 space-y-6 shadow-xl">
              
              {/* Header card info */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded font-mono font-bold border border-indigo-500/20">
                    RAPPORT IA QUALIFICATION
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(selectedLead.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <h4 className="font-display font-extrabold text-lg text-white">
                  {selectedLead.name}
                </h4>
                <p className="text-slate-400 text-xs mt-1">
                  Reçu via <strong>{selectedLead.siteTitle}</strong>
                </p>

                {/* Compliance and Security quick audit bar */}
                <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
                  {selectedLead.consentCILChecked && selectedLead.consentPartnerChecked ? (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      ✓ CIL Conforme
                    </span>
                  ) : (
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      ⚠ CIL Manquant
                    </span>
                  )}

                  {selectedLead.isFlaggedAnomaly ? (
                    <span className="bg-rose-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">
                      ▲ RISQUE {selectedLead.securityRiskLevel?.toUpperCase() || 'LOW'}
                    </span>
                  ) : (
                    <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-mono">
                      IP: {selectedLead.ipAddress || "196.28.14.92"}
                    </span>
                  )}
                </div>
              </div>

              {/* SECURITY TERMINAL BOX IF FLAG ANOMALY */}
              {selectedLead.isFlaggedAnomaly && (
                <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>Alerte Security Guardian AI</span>
                  </div>
                  <p className="text-[11px] text-rose-200">
                    Cette soumission a été signalée comme suspecte (niveau {selectedLead.securityRiskLevel}). Elle a été isolée pour protéger le système d'acquisition centralisé.
                  </p>
                  <div className="bg-black/40 rounded p-2 text-[9px] font-mono text-rose-300/80 leading-normal max-h-24 overflow-y-auto">
                    {selectedLead.securityLogs ? selectedLead.securityLogs.map((log, i) => (
                      <div key={i}>&gt; {log}</div>
                    )) : (
                      <>
                        <div>&gt; Scan de sécurité en cours...</div>
                        <div>&gt; ALERTE : Données jugées suspectes</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Message raw */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Message Brut Client</span>
                <p className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-slate-300 text-xs leading-relaxed max-h-24 overflow-y-auto">
                  "{selectedLead.rawMessage}"
                </p>
              </div>

              {/* IA Qualify outputs */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[9px] text-slate-500 font-mono block">URGENCE IA</span>
                  <span className={`text-xs font-bold ${
                    selectedLead.urgency === 'Élevé' ? 'text-red-400' : 'text-slate-200'
                  }`}>{selectedLead.urgency}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-mono block">BUDGET ESTIMÉ</span>
                  <span className="text-xs font-bold text-slate-200">{selectedLead.budget}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-slate-400 font-medium block mb-0.5">Besoin Synthétisé :</strong>
                  <p className="text-slate-200 leading-relaxed font-semibold text-[11px]">
                    {selectedLead.summarizedNeed}
                  </p>
                </div>
                <div>
                  <strong className="text-slate-400 font-medium block mb-0.5">Point de douleur identifié (Pain Point) :</strong>
                  <p className="text-rose-300 leading-relaxed italic text-[11px]">
                    {selectedLead.keyPainPoint}
                  </p>
                </div>
                <div>
                  <strong className="text-slate-400 font-medium block mb-0.5">Recommandation commerciale :</strong>
                  <p className="text-emerald-400 leading-relaxed text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 inline shrink-0" />
                    {selectedLead.suggestedAction}
                  </p>
                </div>
              </div>

              {/* SMS/WhatsApp draft copy ready */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pb-1.5 border-b border-slate-800">
                  <span>PROJET SMS D'OUTREACH IA</span>
                  <button 
                    onClick={() => handleCopyDraft(selectedLead.responseDraft, selectedLead.id)}
                    className="hover:text-white flex items-center gap-1 transition text-indigo-400 cursor-pointer"
                  >
                    {copiedId === selectedLead.id ? (
                      <>
                        <Check className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">Copié</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed italic whitespace-pre-line">
                  {selectedLead.responseDraft}
                </p>
              </div>

              {/* DISTRIBUTION INTÉLLIGENTE CHANNELS */}
              {selectedLead.assignedPartnerId && !selectedLead.isFlaggedAnomaly && (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block border-b border-slate-850 pb-1">
                    Canaux de Distribution Intelligente active
                  </span>
                  
                  <div className="space-y-2 text-[11px]">
                    {/* Email Channel */}
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800/80">
                      <span className="font-semibold text-slate-300">✉ Email Partenaire</span>
                      {selectedLead.distributionChannels?.email?.sent ? (
                        <span className="text-emerald-400 font-medium">✓ Envoyé ({selectedLead.distributionChannels.email.recipient})</span>
                      ) : (
                        <span className="text-slate-500">Non envoyé</span>
                      )}
                    </div>

                    {/* WhatsApp Channel */}
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800/80">
                      <span className="font-semibold text-slate-300">💬 WhatsApp Business</span>
                      {selectedLead.distributionChannels?.whatsapp?.sent ? (
                        <a 
                          href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(selectedLead.distributionChannels.whatsapp.formattedMessage || '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                        >
                          ✓ Prêt (Lancer wa.me) →
                        </a>
                      ) : (
                        <span className="text-slate-500">Non configuré</span>
                      )}
                    </div>

                    {/* Telegram Bot */}
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800/80">
                      <span className="font-semibold text-slate-300">🤖 Telegram Bot Push</span>
                      {selectedLead.distributionChannels?.telegram?.sent ? (
                        <span className="text-emerald-400 font-mono text-[10px]">✓ Triggered: {selectedLead.distributionChannels.telegram.botCommandTriggered}</span>
                      ) : (
                        <span className="text-slate-500">Désactivé</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Matchmaking controls & Status change */}
              <div className="border-t border-slate-800 pt-4 space-y-4">
                
                {/* Manual state update */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1.5">Mettre à jour le statut</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['new', 'contacted', 'sold', 'rejected'] as Lead['status'][]).map((st) => (
                      <button 
                        key={st}
                        onClick={() => onUpdateLead(selectedLead.id, { status: st })}
                        className={`py-1 rounded text-[10px] font-bold border transition cursor-pointer capitalize ${
                          selectedLead.status === st 
                            ? 'bg-white text-slate-900 border-white' 
                            : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {st === 'new' ? 'Nouv.' : (st === 'contacted' ? 'Cont.' : (st === 'sold' ? 'Vendu' : 'Rejeté'))}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Match partner selection dropdown */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1.5">
                    Attribution Entreprise Locale
                  </label>
                  <select 
                    value={selectedLead.assignedPartnerId || ''}
                    onChange={(e) => onUpdateLead(selectedLead.id, { assignedPartnerId: e.target.value || null })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-hidden"
                  >
                    <option value="">Aucun partenaire attribué</option>
                    {partners.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.sector})</option>
                    ))}
                  </select>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 p-8 text-center flex flex-col items-center justify-center h-48 font-mono text-xs">
              <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
              Sélectionnez un prospect pour voir l'analyse IA.
            </div>
          )}

        </div>

      </div>

      {/* TIMELINE OF RUNNING IA ACTIONS / SYSTEM AUDIT LOGS */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-slate-800 font-display font-bold text-sm flex items-center gap-2">
            <MessageSquare className="w-4.5 h-4.5 text-indigo-500" />
            Moteur de Logs & Activités Autonomes en temps réel
          </h3>
          <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded font-bold">
            STATUT : ACTIF (1.8s latency)
          </span>
        </div>
        
        <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
          {activityLogs.map((log) => (
            <div key={log.id} className="flex gap-3 text-xs items-start">
              <span className="text-slate-400 font-mono text-[10px] shrink-0 mt-0.5">
                {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
              </span>
              <div className="shrink-0 mt-0.5">
                {log.type === 'lead_new' && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block animate-pulse"></span>}
                {log.type === 'lead_qualified' && <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 block"></span>}
                {log.type === 'site_created' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>}
                {log.type === 'partner_matched' && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>}
                {log.type === 'system' && <span className="w-2.5 h-2.5 rounded-full bg-slate-400 block"></span>}
              </div>
              <p className="text-slate-600 flex-1 leading-snug">
                {log.message}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
