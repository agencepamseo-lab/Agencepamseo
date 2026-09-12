import React, { useState, useEffect } from 'react';
import { Lead, Partner, ActivityLog, LeadWorkflowStep } from '../types';
import { apiFetch } from '../api';
import { 
  Users, TrendingUp, CheckCircle, Clock, Copy, Search, Filter, 
  MapPin, ShieldAlert, Award, FileText, ChevronRight, Check, AlertCircle,
  Briefcase, MessageSquare, ArrowRight, UserCheck, Sparkles, Send, Eye,
  Clock3, ThumbsUp, ShieldCheck
} from 'lucide-react';

interface LeadsManagerProps {
  leads: Lead[];
  partners: Partner[];
  activityLogs: ActivityLog[];
  onUpdateLead: (leadId: string, updates: { status?: Lead['status']; assignedPartnerId?: string | null }) => void;
  onRefreshData?: () => void;
}

const WORKFLOW_STEPS: { 
  key: LeadWorkflowStep; 
  stepNum: number; 
  label: string; 
  shortLabel: string; 
  description: string;
}[] = [
  { key: 'RECEIVED', stepNum: 1, label: '1. Reçu', shortLabel: 'Reçu', description: 'Lead ingéré, enregistré en base sans attribution automatique' },
  { key: 'QUALIFIED', stepNum: 2, label: '2. Qualification', shortLabel: 'Qualifié', description: 'Besoin extrait et scoré par l\'IA' },
  { key: 'HUMAN_REVIEW', stepNum: 3, label: '3. Contrôle Humain', shortLabel: 'Contrôle Humain', description: 'Vérification obligatoire par l\'opérateur Lead Factory' },
  { key: 'WAITING_FOR_OFFER', stepNum: 4, label: '4. En attente d\'une offre', shortLabel: 'Attente Offre', description: 'Cadrage de la proposition ou devis' },
  { key: 'VALIDATED', stepNum: 5, label: '5. Validation', shortLabel: 'Validé', description: 'Dossier approuvé, prêt pour transmission' },
  { key: 'TRANSMITTED', stepNum: 6, label: '6. Transmission Partenaire', shortLabel: 'Transmis', description: 'Attribution finale & notification au partenaire' },
];

export default function LeadsManager({ 
  leads = [], 
  partners = [], 
  activityLogs = [], 
  onUpdateLead,
  onRefreshData
}: LeadsManagerProps) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const safePartners = Array.isArray(partners) ? partners : [];
  const safeLogs = Array.isArray(activityLogs) ? activityLogs : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(safeLeads[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Workflow on-demand partner suggestion & transmission state
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedPartner, setSuggestedPartner] = useState<Partner | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [selectedPartnerIdForTransmit, setSelectedPartnerIdForTransmit] = useState<string>('');
  const [transmissionSuccessMessage, setTransmissionSuccessMessage] = useState<string | null>(null);
  const [workflowError, setWorkflowError] = useState<string | null>(null);

  const selectedLead = safeLeads.find(l => l.id === selectedLeadId) || safeLeads[0];

  // Reset helper state when active lead changes
  useEffect(() => {
    setSuggestedPartner(null);
    setTransmissionSuccessMessage(null);
    setWorkflowError(null);
    if (selectedLead?.assignedPartnerId) {
      setSelectedPartnerIdForTransmit(selectedLead.assignedPartnerId);
    } else {
      setSelectedPartnerIdForTransmit('');
    }
  }, [selectedLead?.id]);

  // Calculations
  const totalLeads = safeLeads.length;
  const avgScore = totalLeads > 0 ? Math.round(safeLeads.reduce((acc, l) => acc + (l.score || 0), 0) / totalLeads) : 0;
  const soldLeads = safeLeads.filter(l => l.status === 'sold').length;
  const conversionRate = totalLeads > 0 ? Math.round((soldLeads / totalLeads) * 100) : 0;
  const pendingHumanReviewLeads = safeLeads.filter(l => 
    l.status === 'RECEIVED' || l.status === 'new' || l.status === 'QUALIFIED' || l.status === 'HUMAN_REVIEW'
  ).length;

  // Filters
  const filteredLeads = safeLeads.filter(lead => {
    const matchesSearch = (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (lead.rawMessage || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (lead.phone || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyDraft = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getWorkflowStepIndex = (status: Lead['status']): number => {
    switch (status) {
      case 'RECEIVED':
      case 'new':
        return 1;
      case 'QUALIFIED':
        return 2;
      case 'HUMAN_REVIEW':
        return 3;
      case 'WAITING_FOR_OFFER':
        return 4;
      case 'VALIDATED':
        return 5;
      case 'TRANSMITTED':
      case 'contacted':
      case 'sold':
        return 6;
      default:
        return 1;
    }
  };

  // Change workflow step handler
  const handleTransitionStep = async (targetStep: LeadWorkflowStep) => {
    if (!selectedLead) return;
    setWorkflowError(null);
    setTransmissionSuccessMessage(null);

    try {
      const res = await apiFetch(`/api/leads/${selectedLead.id}/workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStep })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onUpdateLead(selectedLead.id, { status: targetStep });
        if (onRefreshData) onRefreshData();
      } else {
        setWorkflowError(data.error || "Erreur de mise à jour du statut.");
      }
    } catch (err: any) {
      setWorkflowError("Erreur réseau lors de la transition.");
    }
  };

  // On-demand Partner Suggestion
  const handleFetchSuggestedPartner = async () => {
    if (!selectedLead) return;
    setIsSuggesting(true);
    setWorkflowError(null);
    try {
      const res = await apiFetch(`/api/leads/${selectedLead.id}/suggest-partner`);
      if (res.ok) {
        const data = await res.json();
        if (data.suggestedPartner) {
          setSuggestedPartner(data.suggestedPartner);
          setSelectedPartnerIdForTransmit(data.suggestedPartner.id);
        } else {
          setWorkflowError("Aucun partenaire éligible trouvé pour ce secteur et cette localité.");
        }
      }
    } catch (err) {
      setWorkflowError("Impossible de contacter le moteur de suggestion.");
    } finally {
      setIsSuggesting(false);
    }
  };

  // Operator-Validated Manual Partner Transmission
  const handleTransmitToPartner = async () => {
    if (!selectedLead) return;
    setIsTransmitting(true);
    setWorkflowError(null);
    setTransmissionSuccessMessage(null);

    try {
      const res = await apiFetch(`/api/leads/${selectedLead.id}/transmit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId: selectedPartnerIdForTransmit || undefined })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTransmissionSuccessMessage(data.message || "Prospect transmis avec succès au partenaire.");
        onUpdateLead(selectedLead.id, { 
          status: 'TRANSMITTED', 
          assignedPartnerId: data.partner?.id 
        });
        if (onRefreshData) onRefreshData();
      } else {
        setWorkflowError(data.error || "Erreur lors de la transmission au partenaire.");
      }
    } catch (err) {
      setWorkflowError("Erreur de communication avec le serveur.");
    } finally {
      setIsTransmitting(false);
    }
  };

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'RECEIVED':
      case 'new':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">1. Reçu</span>;
      case 'QUALIFIED':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">2. Qualifié</span>;
      case 'HUMAN_REVIEW':
        return <span className="bg-amber-50 text-amber-700 border border-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">3. Contrôle Humain</span>;
      case 'WAITING_FOR_OFFER':
        return <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">4. Attente Offre</span>;
      case 'VALIDATED':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">5. Validé</span>;
      case 'TRANSMITTED':
      case 'contacted':
        return <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">6. Transmis</span>;
      case 'sold':
        return <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">Vendu</span>;
      case 'rejected':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">Rejeté</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">{status}</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 70) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    return 'text-amber-600 bg-amber-50 border-amber-100';
  };

  const currentStepNum = selectedLead ? getWorkflowStepIndex(selectedLead.status) : 1;

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
            <span className="block text-[10px] text-slate-400 mt-0.5">Entrants dans le système</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Contrôle Humain Requis</span>
            <span className="text-xl font-display font-extrabold text-amber-600">{pendingHumanReviewLeads}</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">En cours de révision</span>
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
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Sécurité Commerciale</span>
            <span className="text-sm font-display font-bold text-slate-800">100% Contrôlé</span>
            <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">Aucun dispatch non autorisé</span>
          </div>
        </div>

      </div>

      {/* Main CRM split workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table list column (Left) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display font-bold text-slate-800 text-base">File des Prospects & Pipeline Commercial</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Chaque lead respecte obligatoirement la validation humaine avant toute transmission à un partenaire.
              </p>
            </div>
            
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
                <option value="RECEIVED">1. Reçus (REÇU)</option>
                <option value="QUALIFIED">2. Qualifiés (QUALIFICATION)</option>
                <option value="HUMAN_REVIEW">3. Contrôle Humain</option>
                <option value="WAITING_FOR_OFFER">4. En attente d'offre</option>
                <option value="VALIDATED">5. Validés</option>
                <option value="TRANSMITTED">6. Transmis Partenaire</option>
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
                  <th className="py-3 px-2">Statut Workflow</th>
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
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            {partner.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Non attribué (En attente validation)</span>
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

        {/* Detailed IA Qualification & Workflow Column (Right) */}
        <div className="space-y-6">
          
          {selectedLead ? (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 text-white p-6 space-y-6 shadow-xl">
              
              {/* Header card info */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded font-mono font-bold border border-indigo-500/20">
                    DOSSIER LEAD & CONTRÔLE HUMAIN
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(selectedLead.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <h4 className="font-display font-extrabold text-lg text-white">
                  {selectedLead.name}
                </h4>
                <p className="text-slate-400 text-xs mt-1">
                  Reçu via <strong>{selectedLead.siteTitle}</strong> ({selectedLead.city})
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

                  <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-mono">
                    Tél : {selectedLead.phone}
                  </span>
                </div>
              </div>

              {/* RÈGLE MÉTIER : SÉQUENCE DU WORKFLOW COMMERCIAL */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">Séquence Commerciale & Contrôle Humain</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Étape {currentStepNum} / 6
                  </span>
                </div>

                {/* Visual Step Pipeline (1 to 6) */}
                <div className="grid grid-cols-6 gap-1 py-1">
                  {WORKFLOW_STEPS.map((step) => {
                    const isDone = currentStepNum > step.stepNum;
                    const isCurrent = currentStepNum === step.stepNum;
                    return (
                      <div 
                        key={step.key}
                        onClick={() => handleTransitionStep(step.key)}
                        title={`${step.label} : ${step.description}`}
                        className={`text-center py-2 px-1 rounded cursor-pointer transition flex flex-col items-center justify-between h-14 ${
                          isCurrent 
                            ? 'bg-amber-500/20 border border-amber-400 text-amber-300 font-bold' 
                            : (isDone 
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                                : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300')
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold">
                          {isDone ? '✓' : step.stepNum}
                        </div>
                        <span className="text-[8px] leading-tight line-clamp-2 uppercase">
                          {step.shortLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Current step banner and next suggested actions */}
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Statut actuel :</span>
                    <div>{getStatusBadge(selectedLead.status)}</div>
                  </div>

                  <p className="text-[11px] text-slate-300 italic">
                    {WORKFLOW_STEPS.find(s => s.stepNum === currentStepNum)?.description || 'Étape du cycle commercial'}
                  </p>

                  {/* Feedback message / Error */}
                  {workflowError && (
                    <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px] p-2 rounded flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{workflowError}</span>
                    </div>
                  )}

                  {transmissionSuccessMessage && (
                    <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[11px] p-2 rounded flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{transmissionSuccessMessage}</span>
                    </div>
                  )}

                  {/* Action transitions depending on current state */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                    {(selectedLead.status === 'RECEIVED' || selectedLead.status === 'new') && (
                      <>
                        <button
                          onClick={() => handleTransitionStep('QUALIFIED')}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Passer en Qualification →
                        </button>
                        <button
                          onClick={() => handleTransitionStep('HUMAN_REVIEW')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Prendre en Contrôle Humain →
                        </button>
                      </>
                    )}

                    {selectedLead.status === 'QUALIFIED' && (
                      <button
                        onClick={() => handleTransitionStep('HUMAN_REVIEW')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Démarrer le Contrôle Humain (Opérateur) →
                      </button>
                    )}

                    {selectedLead.status === 'HUMAN_REVIEW' && (
                      <>
                        <button
                          onClick={() => handleTransitionStep('WAITING_FOR_OFFER')}
                          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Clock3 className="w-3.5 h-3.5" />
                          En attente d'une offre →
                        </button>
                        <button
                          onClick={() => handleTransitionStep('VALIDATED')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Valider le dossier (Approuver) →
                        </button>
                      </>
                    )}

                    {selectedLead.status === 'WAITING_FOR_OFFER' && (
                      <button
                        onClick={() => handleTransitionStep('VALIDATED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Offre prête : Valider le dossier →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* MODULE DE TRANSMISSION PARTENAIRE APRÈS CONTRÔLE HUMAIN */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-200">Transmission Partenaire (Contrôle Humain Validé)</span>
                  </div>
                  {selectedLead.assignedPartnerId ? (
                    <span className="text-[10px] text-emerald-400 font-semibold">Attribué</span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-semibold">En attente d'attribution</span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  L'attribution et l'envoi d'emails/WhatsApp aux partenaires sont <strong>strictement réservés à l'opérateur</strong> après contrôle et validation du dossier.
                </p>

                {/* Suggest button & Suggested result */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFetchSuggestedPartner}
                      disabled={isSuggesting}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isSuggesting ? "Calcul éligibilité..." : "Suggérer le partenaire idéal (Matching IA)"}
                    </button>
                  </div>

                  {suggestedPartner && (
                    <div className="bg-indigo-950/40 border border-indigo-800/50 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between items-center text-indigo-200 font-semibold">
                        <span>Recommandé : {suggestedPartner.name}</span>
                        <span className="text-[10px] font-mono bg-indigo-900/60 px-2 py-0.5 rounded text-indigo-300">
                          {suggestedPartner.sector} ({suggestedPartner.city})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {suggestedPartner.email} • {suggestedPartner.leadsReceived} leads reçus (Rotation équitable)
                      </div>
                    </div>
                  )}
                </div>

                {/* Partner selector dropdown */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1.5">
                    Sélectionner le Partenaire Destinataire
                  </label>
                  <select 
                    value={selectedPartnerIdForTransmit}
                    onChange={(e) => setSelectedPartnerIdForTransmit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-hidden"
                  >
                    <option value="">-- Choisir un partenaire certifié --</option>
                    {partners.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.sector} ({p.city}) [{p.leadsReceived} leads reçus]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit transmission button */}
                <button
                  onClick={handleTransmitToPartner}
                  disabled={isTransmitting || (!selectedPartnerIdForTransmit && !suggestedPartner)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-950"
                >
                  <Send className="w-4 h-4" />
                  {isTransmitting ? "Validation & transmission en cours..." : "Valider et Transmettre au Partenaire (Notification officielle)"}
                </button>
              </div>

              {/* Message brut client */}
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
                  <strong className="text-slate-400 font-medium block mb-0.5">Point de douleur identifié :</strong>
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
                  <span>PROJET DE RÉPONSE COMMERCIAL</span>
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

              {/* DISTRIBUTION CANAUX ÉTAT RÉEL */}
              {selectedLead.assignedPartnerId && (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block border-b border-slate-800 pb-1">
                    État Réel de Transmission Partenaire
                  </span>
                  
                  <div className="space-y-2 text-[11px]">
                    {/* Email Channel */}
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800/80">
                      <span className="font-semibold text-slate-300">✉ Email Partenaire</span>
                      {selectedLead.distributionChannels?.email?.sent ? (
                        <span className="text-emerald-400 font-medium">✓ Notifié ({selectedLead.distributionChannels.email.recipient})</span>
                      ) : (
                        <span className="text-amber-400">En attente de transmission</span>
                      )}
                    </div>

                    {/* WhatsApp Channel */}
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800/80">
                      <span className="font-semibold text-slate-300">💬 WhatsApp Partenaire</span>
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
                        <span className="text-slate-500">Non déclenché</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sélecteur de statut manuel pour l'opérateur */}
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1.5">
                  Ajustement Rapide de Statut (Opérateur)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['RECEIVED', 'QUALIFIED', 'HUMAN_REVIEW', 'WAITING_FOR_OFFER', 'VALIDATED', 'TRANSMITTED'] as LeadWorkflowStep[]).map((st) => (
                    <button 
                      key={st}
                      onClick={() => handleTransitionStep(st)}
                      className={`py-1 px-1 rounded text-[9px] font-bold border transition cursor-pointer truncate ${
                        selectedLead.status === st 
                          ? 'bg-white text-slate-900 border-white' 
                          : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {st === 'RECEIVED' ? '1. Reçu' :
                       st === 'QUALIFIED' ? '2. Qualifié' :
                       st === 'HUMAN_REVIEW' ? '3. Contrôle' :
                       st === 'WAITING_FOR_OFFER' ? '4. Offre' :
                       st === 'VALIDATED' ? '5. Validé' : '6. Transmis'}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button 
                    onClick={() => handleTransitionStep('sold' as any)}
                    className={`py-1 rounded text-[9px] font-bold border transition cursor-pointer ${
                      selectedLead.status === 'sold'
                        ? 'bg-green-600 text-white border-green-500'
                        : 'bg-slate-800/40 text-green-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Marquer Conclu / Vendu
                  </button>
                  <button 
                    onClick={() => handleTransitionStep('rejected' as any)}
                    className={`py-1 rounded text-[9px] font-bold border transition cursor-pointer ${
                      selectedLead.status === 'rejected'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-800/40 text-rose-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Rejeter le prospect
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 p-8 text-center flex flex-col items-center justify-center h-48 font-mono text-xs">
              <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
              Sélectionnez un prospect pour ouvrir le panneau de contrôle humain.
            </div>
          )}

        </div>

      </div>

      {/* TIMELINE OF AUDIT & ACTIVITY LOGS */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-slate-800 font-display font-bold text-sm flex items-center gap-2">
            <MessageSquare className="w-4.5 h-4.5 text-indigo-500" />
            Moteur de Logs & Activités en temps réel
          </h3>
          <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded font-bold">
            {activityLogs.length} événements enregistrés
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
