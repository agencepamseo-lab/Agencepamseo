import React, { useState, useEffect } from 'react';
import { DBState, Site, Lead, Partner, ActivityLog, SecurityEvent } from './types';
import MarketResearch from './components/MarketResearch';
import SiteGenerator from './components/SiteGenerator';
import LeadsManager from './components/LeadsManager';
import PartnersManager from './components/PartnersManager';
import PartnerWorkspace from './components/PartnerWorkspace';
import MicrositePreview from './components/MicrositePreview';
import AgentCompliance from './components/AgentCompliance';
import AgentSecurity from './components/AgentSecurity';
import { 
  Building2, Sparkles, Database, RefreshCw, Layers, TrendingUp, 
  MapPin, HelpCircle, Laptop, Landmark, Smartphone, Play, 
  Trash2, Globe, Bot, ChevronRight, CheckCircle2, Award, Plus,
  ShieldCheck, Lock
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'market' | 'generator' | 'leads' | 'partners' | 'workspace' | 'compliance' | 'security'>('market');
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'partner'>('admin');
  const [dbState, setDbState] = useState<DBState>({
    sites: [],
    leads: [],
    partners: [],
    marketTrends: [],
    activityLogs: [],
    securityEvents: []
  });
  const [isDbLoading, setIsDbLoading] = useState(true);

  // Prefill state for Site Generator tab
  const [prefilledSector, setPrefilledSector] = useState('');
  const [prefilledKeyword, setPrefilledKeyword] = useState('');

  // Active preview microsite
  const [previewSite, setPreviewSite] = useState<Site | null>(null);

  // Fetch initial state from the Express Server
  const fetchDbState = async () => {
    setIsDbLoading(true);
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      setDbState(data);
    } catch (error) {
      console.error('Failed to fetch DB state:', error);
    } finally {
      setIsDbLoading(false);
    }
  };

  useEffect(() => {
    fetchDbState();
  }, []);

  // Reset data to perfect Burkinabè seed state
  const handleResetData = async () => {
    if (!window.confirm("Voulez-vous réinitialiser toutes les données aux valeurs de démonstration ?")) return;
    try {
      const response = await fetch('/api/data/reset', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setDbState(data.state);
        alert("Données réinitialisées avec succès !");
      }
    } catch (error) {
      console.error('Reset failed:', error);
    }
  };

  // Callback when Market Research triggers site creation
  const handleTriggerSiteGeneration = (sector: string, keyword: string) => {
    setPrefilledSector(sector);
    setPrefilledKeyword(keyword);
    setActiveTab('generator');
  };

  // Clear prefills
  const handleClearPrefills = () => {
    setPrefilledSector('');
    setPrefilledKeyword('');
  };

  // Callback when a site is successfully deployed
  const handleSiteCreated = (newSite: Site) => {
    setDbState(prev => ({
      ...prev,
      sites: [...prev.sites, newSite],
      activityLogs: [
        {
          id: 'log-' + Date.now(),
          type: 'site_created',
          message: `Nouveau microsite d'acquisition déployé : ${newSite.title}`,
          timestamp: new Date().toISOString()
        },
        ...prev.activityLogs
      ]
    }));
    // Redirect to show the active sites
    setActiveTab('leads');
  };

  // Callback when a partner is registered
  const handleAddPartner = async (newPartnerData: Omit<Partner, 'id' | 'leadsReceived' | 'revenueGenerated' | 'status'>) => {
    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartnerData)
      });
      const registeredPartner = await response.json();
      setDbState(prev => ({
        ...prev,
        partners: [...prev.partners, registeredPartner],
        activityLogs: [
          {
            id: 'log-' + Date.now(),
            type: 'partner_matched',
            message: `Partenaire local enregistré : ${registeredPartner.name}`,
            timestamp: new Date().toISOString()
          },
          ...prev.activityLogs
        ]
      }));
    } catch (error) {
      console.error('Add partner failed:', error);
    }
  };

  // Callback when lead details are modified
  const handleUpdateLead = async (leadId: string, updates: { status?: Lead['status']; assignedPartnerId?: string | null }) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updatedLead = await response.json();
      
      // Update local state by calling server state to sync revenue calculations
      const freshRes = await fetch('/api/data');
      const freshData = await freshRes.json();
      setDbState(freshData);
    } catch (error) {
      console.error('Update lead failed:', error);
    }
  };

  // Callback when a new lead is captured from the interactive preview
  const handleLeadCaptured = (newLead: Lead) => {
    // Add lead and trigger state refresh from server to grab correct automated matches & metrics
    fetchDbState();
  };

  // Delete site handler
  const handleDeleteSite = async (siteId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce microsite d'acquisition ?")) return;
    try {
      const response = await fetch(`/api/sites/${siteId}`, { method: 'DELETE' });
      if (response.ok) {
        setDbState(prev => ({
          ...prev,
          sites: prev.sites.filter(s => s.id !== siteId)
        }));
        alert("Microsite supprimé.");
      }
    } catch (error) {
      console.error('Failed to delete site:', error);
    }
  };

  // Trigger encrypted backup for security guardian
  const handleTriggerBackup = async () => {
    try {
      const response = await fetch('/api/security/backup', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        await fetchDbState();
        return data;
      }
    } catch (error) {
      console.error('Backup failed:', error);
    }
    return null;
  };

  // Format CFA Currency
  const formatCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 })
      .format(amount)
      .replace('XOF', 'FCFA');
  };

  const totalRevenues = dbState.partners.reduce((sum, p) => sum + p.revenueGenerated, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Platform Upper Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between sm:items-center shadow-xs">
        
        {/* Branding & Territory */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/10">
            <Layers className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-extrabold tracking-tight text-slate-950">
                LeadFactory <span className="text-indigo-600">Africa AI</span>
              </h1>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                MVP v1.0
              </span>
            </div>
            <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Pilote : Bobo-Dioulasso, Burkina Faso</span>
            </p>
          </div>
        </div>

        {/* Global Stats bar (Hidden if role is Partner to preserve confidentiality) */}
        {userRole !== 'partner' ? (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 font-medium bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-2.5">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span><strong>{dbState.sites.length}</strong> Sites actifs</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span><strong>{dbState.leads.length}</strong> Prospects qualifiés</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span><strong>{dbState.partners.length}</strong> Partenaires</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-slate-700" />
              <span className="text-slate-800 font-bold">{formatCFA(totalRevenues)}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-2 rounded-xl border border-indigo-100">
            🔒 Espace Partenaire Sécurisé CIL
          </div>
        )}

        {/* Role Selector with RBAC Simulation */}
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 shrink-0">
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Rôle :</span>
          <select 
            value={userRole} 
            onChange={(e) => {
              const r = e.target.value as 'admin' | 'manager' | 'partner';
              setUserRole(r);
              if (r === 'partner') {
                setActiveTab('workspace');
              } else if (r === 'manager') {
                setActiveTab('leads');
              } else {
                setActiveTab('market');
              }
            }}
            className="bg-transparent text-xs text-slate-800 font-bold border-none outline-hidden focus:ring-0 cursor-pointer"
          >
            <option value="admin">Administrateur LeadFactory</option>
            <option value="manager">Gestionnaire Commercial</option>
            <option value="partner">Entreprise Partenaire</option>
          </select>
        </div>

        {/* Reset button tool */}
        <button 
          onClick={handleResetData}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-xl border border-slate-200/60 transition flex items-center gap-1 text-xs font-semibold cursor-pointer shrink-0"
          title="Réinitialiser les données de démo"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden md:inline">Démo Reset</span>
        </button>

      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar navigation */}
        <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-900 text-slate-300 p-4 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Admin & Manager Sidebar Section */}
            {userRole !== 'partner' && (
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider block px-3">Espace Administration</span>
                <nav className="space-y-1">
                  {userRole === 'admin' && (
                    <>
                      <button 
                        onClick={() => setActiveTab('market')}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-3 cursor-pointer ${
                          activeTab === 'market' 
                            ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/10' 
                            : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span>1. Moteur Marché IA</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('generator')}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-3 cursor-pointer ${
                          activeTab === 'generator' 
                            ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/10' 
                            : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>2. Générateur de Sites</span>
                      </button>
                    </>
                  )}

                  <button 
                    onClick={() => setActiveTab('leads')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-3 cursor-pointer ${
                      activeTab === 'leads' 
                        ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/10' 
                        : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Database className="w-4 h-4" />
                    <span>3. CRM & Qualification IA</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('partners')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-3 cursor-pointer ${
                      activeTab === 'partners' 
                        ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/10' 
                        : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>4. Entreprises Partenaires</span>
                  </button>

                  {/* Added CIL Compliance Tab for Admin and Manager roles */}
                  <button 
                    onClick={() => setActiveTab('compliance')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-3 cursor-pointer ${
                      activeTab === 'compliance' 
                        ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/10' 
                        : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>5. Agent Compliance</span>
                  </button>

                  {/* Added Security Guardian Tab only for Admin */}
                  {userRole === 'admin' && (
                    <button 
                      onClick={() => setActiveTab('security')}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-3 cursor-pointer ${
                        activeTab === 'security' 
                          ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/10' 
                          : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Lock className="w-4 h-4 text-rose-400" />
                      <span>6. Agent Sécurité IA</span>
                    </button>
                  )}
                </nav>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider block px-3">Espace Partenaire</span>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('workspace')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-3 cursor-pointer ${
                    activeTab === 'workspace' 
                      ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/10' 
                      : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Laptop className="w-4 h-4" />
                  <span>{userRole === 'partner' ? '📥 Mes Prospects Qualifiés' : '7. Espace Entreprises'}</span>
                </button>
              </nav>
            </div>

          </div>

          {/* Connected state block */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase">
              Centre de connaissances IA
            </span>
            <div className="text-[11px] text-slate-400 leading-normal">
              Mémoire active : <strong className="text-white">{dbState.sites.length} sites</strong>, <strong className="text-white">{dbState.leads.length} opportunités</strong>, <strong className="text-white">{dbState.partners.length} entreprises</strong> à Bobo-Dioulasso.
            </div>
          </div>

        </aside>

        {/* Content body layout */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
          
          {isDbLoading && dbState.sites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-slate-500 text-sm">Chargement des données de la plateforme...</p>
            </div>
          ) : (
            <>
              {/* Active Tab View routers */}
              {activeTab === 'market' && userRole === 'admin' && (
                <MarketResearch 
                  trends={dbState.marketTrends} 
                  onTriggerSiteGeneration={handleTriggerSiteGeneration} 
                />
              )}

              {activeTab === 'generator' && userRole === 'admin' && (
                <SiteGenerator 
                  onSiteCreated={handleSiteCreated} 
                  prefilledSector={prefilledSector}
                  prefilledKeyword={prefilledKeyword}
                  onClearPrefills={handleClearPrefills}
                />
              )}

              {activeTab === 'leads' && userRole !== 'partner' && (
                <LeadsManager 
                  leads={dbState.leads} 
                  partners={dbState.partners} 
                  activityLogs={dbState.activityLogs}
                  onUpdateLead={handleUpdateLead} 
                />
              )}

              {activeTab === 'partners' && userRole !== 'partner' && (
                <PartnersManager 
                  partners={dbState.partners} 
                  onAddPartner={handleAddPartner} 
                />
              )}

              {activeTab === 'workspace' && (
                <PartnerWorkspace 
                  leads={dbState.leads} 
                  partners={dbState.partners} 
                  onUpdateLead={handleUpdateLead} 
                />
              )}

              {activeTab === 'compliance' && userRole !== 'partner' && (
                <AgentCompliance 
                  sitesCount={dbState.sites.length}
                  compliantSitesCount={dbState.sites.filter(s => s.isCILCompliant).length}
                />
              )}

              {activeTab === 'security' && userRole === 'admin' && (
                <AgentSecurity 
                  securityEvents={dbState.securityEvents || []}
                  onTriggerBackup={handleTriggerBackup}
                />
              )}

              {/* LIST OF DEPLOYED ACQUISITION SITES (Always visible in bottom for admin/manager, hidden for partners for confidentiality) */}
              {userRole !== 'partner' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-slate-800 font-display font-bold text-base flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-500" />
                        Canaux d'acquisition et sites thématiques actifs (MVP)
                      </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Ces sites capturent le trafic local à Bobo-Dioulasso. Cliquez sur "Aperçu interactif" pour les tester.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      handleClearPrefills();
                      setActiveTab('generator');
                    }}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Créer un canal</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dbState.sites.map((site) => (
                    <div 
                      key={site.id} 
                      className="border border-slate-100 rounded-xl p-5 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] bg-slate-100 border border-slate-200/80 text-slate-500 px-2 py-0.5 rounded font-mono font-bold capitalize">
                            {site.theme}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                            Active
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-slate-800 text-sm">{site.title}</h4>
                        <p className="text-slate-400 font-mono text-[10px] mt-0.5">{site.domain}</p>
                        
                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mt-2.5">
                          {site.headline}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 border border-slate-100/60 p-2.5 rounded-lg my-4 text-xs font-medium">
                          <div>
                            <span className="block text-[9px] text-slate-400 font-mono uppercase">Zone</span>
                            <span className="text-slate-700 font-semibold">{site.city}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 font-mono uppercase">Prospects Reçus</span>
                            <span className="text-indigo-600 font-bold">{site.leadsCount} leads</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-slate-100 pt-3">
                        <button 
                          onClick={() => setPreviewSite(site)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Aperçu Interactif</span>
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteSite(site.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-slate-200/40 hover:border-rose-100 cursor-pointer"
                          title="Supprimer le microsite"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>)}
            </>
          )}

        </main>

      </div>

      {/* Interactive Floating Microsite Simulator Canvas */}
      {previewSite && (
        <MicrositePreview 
          site={previewSite} 
          onClose={() => setPreviewSite(null)} 
          onLeadSubmitted={handleLeadCaptured}
        />
      )}

    </div>
  );
}
