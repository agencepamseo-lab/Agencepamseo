import React, { useState } from 'react';
import { Partner } from '../types';
import { apiFetch } from '../api';
import { 
  Building2, PlusCircle, CheckCircle, Award, ShieldAlert, BadgeDollarSign, 
  Sparkles, Phone, Mail, MapPin, Check, Plus, AlertCircle, RefreshCw,
  Clock, CreditCard, Shield, RotateCcw, AlertTriangle
} from 'lucide-react';

interface PartnersManagerProps {
  partners: Partner[];
  onAddPartner: (newPartner: Partial<Partner> & { name: string; sector: string; phone: string; email: string; subscriptionPlan: 'Starter' | 'Business' | 'Premium' }) => void;
  onRefresh?: () => void;
}

export default function PartnersManager({ partners = [], onAddPartner, onRefresh }: PartnersManagerProps) {
  const safePartners = Array.isArray(partners) ? partners : [];
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [sector, setSector] = useState('solaire');
  const [city, setCity] = useState('Bobo-Dioulasso');
  const [geographicScope, setGeographicScope] = useState('Bobo-Dioulasso');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState<'Starter' | 'Business' | 'Premium'>('Starter');
  const [exclusiveAccess, setExclusiveAccess] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    onAddPartner({
      name,
      sector,
      city,
      geographicScope: geographicScope || city,
      phone,
      email,
      subscriptionPlan,
      subscriptionStatus: 'active',
      paymentStatus: 'paid',
      maxLeadsPerMonth: subscriptionPlan === 'Premium' ? 9999 : (subscriptionPlan === 'Business' ? 25 : 10),
      exclusiveAccess: subscriptionPlan === 'Premium' ? true : exclusiveAccess
    });

    // Reset Form
    setName('');
    setPhone('');
    setEmail('');
    setSubscriptionPlan('Starter');
    setExclusiveAccess(false);
    setShowAddForm(false);
  };

  const handleConfirmPayment = async (partner: Partner) => {
    const ref = window.prompt(`Confirmer le règlement pour ${partner.name} (${partner.subscriptionPlan}) :\nEntrez la référence de transaction (Orange Money / Moov Money / Virement) :`, `OM-${Date.now().toString().slice(-6)}`);
    if (!ref) return;

    setActionLoading(partner.id);
    try {
      const amount = partner.subscriptionPlan === 'Premium' ? 90000 : (partner.subscriptionPlan === 'Business' ? 35000 : 10000);
      const res = await apiFetch(`/api/partners/${partner.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentReference: ref, amount, extendDays: 30 })
      });
      if (res.ok) {
        if (onRefresh) onRefresh();
        else window.location.reload();
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (partner: Partner) => {
    const reason = window.prompt(`Motif de suspension pour ${partner.name} :`, 'Défaut de paiement / Échéance dépassée');
    if (!reason) return;

    setActionLoading(partner.id);
    try {
      const res = await apiFetch(`/api/partners/${partner.id}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        if (onRefresh) onRefresh();
        else window.location.reload();
      }
    } catch (err) {
      console.error('Error suspending partner:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (partner: Partner) => {
    if (!window.confirm(`Réactiver le partenaire ${partner.name} et le rendre éligible à la réception de nouveaux leads ?`)) return;

    setActionLoading(partner.id);
    try {
      const res = await apiFetch(`/api/partners/${partner.id}/reactivate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        if (onRefresh) onRefresh();
        else window.location.reload();
      }
    } catch (err) {
      console.error('Error reactivating partner:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAuditSubscriptions = async () => {
    setActionLoading('audit');
    try {
      const res = await apiFetch('/api/partners/check-subscriptions', { 
        method: 'POST'
      });
      const data = await res.json();
      setAuditMessage(`Audit effectué : ${data.checked} partenaires analysés. ${data.active} actifs et payés, ${data.suspended} suspendus pour impayé/expiration.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: Partner['status']) => {
    switch (status) {
      case 'active':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span>;
      case 'discovery':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] px-2 py-0.5 rounded-full font-bold">DÉCOUVERTE</span>;
      case 'suspended':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] px-2 py-0.5 rounded-full font-bold">SUSPENDU</span>;
    }
  };

  const getPaymentBadge = (paymentStatus?: string) => {
    switch (paymentStatus) {
      case 'paid':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded font-bold">PAID</span>;
      case 'pending':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded font-bold">PENDING</span>;
      case 'overdue':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] px-2 py-0.5 rounded font-bold">OVERDUE</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-bold">PAID</span>;
    }
  };

  const formatCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 })
      .format(amount)
      .replace('XOF', 'FCFA');
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Commercial engine monetization explainer banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white border border-emerald-800/20 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20 mb-4">
              <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
              <span>Modèle Économique C — Abonnement & Éligibilité Lead</span>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-extrabold mb-3 text-white">
              Distribution autonome et monétisation par abonnement
            </h3>
            <p className="text-emerald-100/80 text-xs leading-relaxed mb-6">
              Les partenaires ne paient pas pour un nombre fixe de leads, mais pour être <strong>éligibles aux leads de leur secteur et périmètre géographique</strong>. Tant que le partenaire est <code>ACTIVE</code> et <code>PAID</code>, les opportunités qualifiées lui sont acheminées automatiquement avec rotation équitable et notification email instantanée.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-emerald-800/40 pt-5">
              <div>
                <span className="block text-[9px] text-emerald-300 font-mono font-bold uppercase">ABONNEMENT STARTER</span>
                <span className="text-sm font-extrabold text-white">10 000 FCFA / mois</span>
                <span className="block text-[10px] text-emerald-200/60 mt-0.5">Quota 10 leads max</span>
              </div>
              <div>
                <span className="block text-[9px] text-emerald-300 font-mono font-bold uppercase">ABONNEMENT BUSINESS</span>
                <span className="text-sm font-extrabold text-white">35 000 FCFA / mois</span>
                <span className="block text-[10px] text-emerald-200/60 mt-0.5">Quota 25 leads max</span>
              </div>
              <div>
                <span className="block text-[9px] text-emerald-300 font-mono font-bold uppercase">ABONNEMENT PREMIUM</span>
                <span className="text-sm font-extrabold text-white">90 000 FCFA / mois</span>
                <span className="block text-[10px] text-emerald-200/60 mt-0.5">Leads illimités & priorité IA</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        </div>

        {/* Visual subscription helper widget */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-slate-800 font-display font-bold text-sm flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              Contrôles Échéances & Audit
            </h4>
            <p className="text-slate-500 text-xs leading-normal">
              Vérifiez la validité des abonnements partenaires. Tout partenaire dont le paiement est échu passe en statut suspendu et n'intercepte plus les nouveaux leads.
            </p>
            {auditMessage && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-800 font-medium">
                {auditMessage}
              </div>
            )}
            <button 
              onClick={handleAuditSubscriptions}
              disabled={actionLoading === 'audit'}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${actionLoading === 'audit' ? 'animate-spin' : ''}`} />
              <span>Vérifier échéances abonnements</span>
            </button>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer mt-4"
          >
            <Plus className="w-4 h-4" />
            <span>Enregistrer un nouveau partenaire</span>
          </button>
        </div>

      </div>

      {/* Form modal or expand panel to add a partner */}
      {showAddForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs max-w-xl animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
            <h4 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              Nouveau partenaire commercial (Réseau local)
            </h4>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Annuler
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Raison sociale / Nom *</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sahel Solaire SARL"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-800 text-slate-700 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Secteur d'activité *</label>
                <select 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-800 text-slate-700 text-xs font-medium"
                >
                  <option value="solaire">Énergie Solaire</option>
                  <option value="formation">Formation Professionnelle</option>
                  <option value="immobilier">Immobilier / BTP</option>
                  <option value="agriculture">Agriculture & Élevage</option>
                  <option value="forage">Forage & Hydraulique</option>
                  <option value="tous">Tous secteurs (National)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Périmètre géographique *</label>
                <select 
                  value={geographicScope}
                  onChange={(e) => setGeographicScope(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-800 text-slate-700 text-xs font-medium"
                >
                  <option value="Bobo-Dioulasso">Bobo-Dioulasso</option>
                  <option value="Ouagadougou">Ouagadougou</option>
                  <option value="Koudougou">Koudougou</option>
                  <option value="Burkina Faso">Burkina Faso (National)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Téléphone direct *</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: +226 20 00 00 00"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-800 text-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email de notification lead *</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@entreprise.com"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-800 text-slate-700 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Formule d'abonnement *</label>
                <select 
                  value={subscriptionPlan}
                  onChange={(e) => {
                    const plan = e.target.value as 'Starter' | 'Business' | 'Premium';
                    setSubscriptionPlan(plan);
                    if (plan === 'Premium') {
                      setExclusiveAccess(true);
                    }
                  }}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-800 text-slate-700 text-xs font-medium"
                >
                  <option value="Starter">Starter (10 leads max/mois - 10 000 FCFA)</option>
                  <option value="Business">Business (25 leads max/mois - 35 000 FCFA)</option>
                  <option value="Premium">Premium (Leads illimités & Exclusivité - 90 000 FCFA)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Ville d'exercice</label>
                <input 
                  type="text" 
                  disabled
                  value={city}
                  className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            {/* Exclusive leads toggle for Business partners */}
            {subscriptionPlan !== 'Premium' && (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl">
                <input 
                  type="checkbox"
                  id="exclusiveAccess"
                  checked={exclusiveAccess}
                  onChange={(e) => setExclusiveAccess(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <div>
                  <label htmlFor="exclusiveAccess" className="block text-xs font-bold text-slate-800 cursor-pointer">
                    Exclusivité sectorielle sur les opportunités (Option)
                  </label>
                  <span className="text-[10px] text-slate-500 leading-normal block">
                    Si coché, ce partenaire recevra en exclusivité temporaire tous les nouveaux prospects qualifiés de son secteur.
                  </span>
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-xl transition"
            >
              Enregistrer l'entreprise partenaire
            </button>
          </form>
        </div>
      )}

      {/* Directory database list of partners */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-slate-800 font-display font-bold text-base border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-500" />
          Répertoire des entreprises partenaires agréées
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Entreprise / PME</th>
                <th className="py-3 px-2">Secteur & Périmètre</th>
                <th className="py-3 px-2">Abonnement</th>
                <th className="py-3 px-2 text-center">Paiement</th>
                <th className="py-3 px-2 text-center">Statut</th>
                <th className="py-3 px-2 text-center">Leads Reçus / Limite</th>
                <th className="py-3 px-2 text-right">Revenus cumulés</th>
                <th className="py-3 px-3 text-right">Actions Opérateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safePartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-3">
                    <div className="font-semibold text-slate-800 text-xs">{partner.name}</div>
                    <div className="text-slate-400 text-[10px] mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-300" />
                        {partner.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-300" />
                        {partner.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold uppercase w-fit">
                        {partner.sector}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        {partner.geographicScope || partner.city}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="font-semibold text-slate-800">{partner.subscriptionPlan}</div>
                    {partner.subscriptionExpiresAt && (
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-300" />
                        Échéance : {new Date(partner.subscriptionExpiresAt).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                    {partner.exclusiveAccess && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-100 mt-1">
                        ✨ Exclusif
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center">
                    {getPaymentBadge(partner.paymentStatus)}
                  </td>
                  <td className="py-4 px-2 text-center">
                    {getStatusBadge(partner.status)}
                  </td>
                  <td className="py-4 px-2 text-center text-slate-700 font-semibold">
                    {partner.leadsReceived} <span className="text-slate-400">/</span> {partner.maxLeadsPerMonth === 9999 ? '∞' : partner.maxLeadsPerMonth}
                    {partner.rotationIndex !== undefined && (
                      <div className="text-[9px] text-slate-400 font-normal">Rotation #{partner.rotationIndex}</div>
                    )}
                  </td>
                  <td className="py-4 px-2 text-right font-mono font-bold text-emerald-600">
                    {formatCFA(partner.revenueGenerated)}
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleConfirmPayment(partner)}
                        disabled={actionLoading === partner.id}
                        title="Confirmer paiement d'abonnement (+30j)"
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>Paiement</span>
                      </button>

                      {partner.status === 'active' ? (
                        <button
                          onClick={() => handleSuspend(partner)}
                          disabled={actionLoading === partner.id}
                          title="Suspendre le partenaire pour impayé"
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Suspendre</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(partner)}
                          disabled={actionLoading === partner.id}
                          title="Réactiver le partenaire"
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Réactiver</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
