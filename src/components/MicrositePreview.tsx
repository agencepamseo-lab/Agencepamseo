import React, { useState } from 'react';
import { Site, Lead } from '../types';
import { 
  Sun, GraduationCap, Building, Droplets, Leaf, 
  Send, Bot, HelpCircle, CheckCircle, Smartphone, 
  Globe, PhoneCall, Mail, MapPin, Sparkles, Loader2, X,
  Battery, Home, Heart, CheckCircle2, Facebook, Instagram, 
  Linkedin, Youtube, ArrowRight
} from 'lucide-react';

interface MicrositePreviewProps {
  site: Site;
  onClose: () => void;
  onLeadSubmitted: (newLead: Lead) => void;
}

export default function MicrositePreview({ site, onClose, onLeadSubmitted }: MicrositePreviewProps) {
  // Chatbot State
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: site.chatbotGreeting }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Form Submission State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [consentCIL, setConsentCIL] = useState(false);
  const [consentPartner, setConsentPartner] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<Lead | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);

  // Theme Styling Map
  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'solaire':
        return {
          primary: 'bg-amber-600 hover:bg-amber-700 text-white',
          text: 'text-amber-600',
          bgLight: 'bg-amber-50',
          border: 'border-amber-200',
          accent: 'amber',
          icon: <Sun className="w-6 h-6 text-amber-500" />
        };
      case 'formation':
        return {
          primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
          text: 'text-indigo-600',
          bgLight: 'bg-indigo-50',
          border: 'border-indigo-200',
          accent: 'indigo',
          icon: <GraduationCap className="w-6 h-6 text-indigo-500" />
        };
      case 'immobilier':
        return {
          primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          text: 'text-emerald-600',
          bgLight: 'bg-emerald-50',
          border: 'border-emerald-200',
          accent: 'emerald',
          icon: <Building className="w-6 h-6 text-emerald-500" />
        };
      case 'forage':
        return {
          primary: 'bg-sky-600 hover:bg-sky-700 text-white',
          text: 'text-sky-600',
          bgLight: 'bg-sky-50',
          border: 'border-sky-200',
          accent: 'sky',
          icon: <Droplets className="w-6 h-6 text-sky-500" />
        };
      case 'agriculture':
        return {
          primary: 'bg-lime-700 hover:bg-lime-800 text-white',
          text: 'text-lime-700',
          bgLight: 'bg-lime-50',
          border: 'border-lime-200',
          accent: 'lime',
          icon: <Leaf className="w-6 h-6 text-lime-600" />
        };
      default:
        return {
          primary: 'bg-gray-800 hover:bg-gray-900 text-white',
          text: 'text-gray-800',
          bgLight: 'bg-gray-50',
          border: 'border-gray-200',
          accent: 'gray',
          icon: <Sparkles className="w-6 h-6 text-gray-500" />
        };
    }
  };

  const styles = getThemeStyles(site.theme);

  // Handle chatbot messaging
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatMessage('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: site.id,
          message: userMsg
        })
      });
      const data = await response.json();
      setChatHistory(prev => [...prev, { sender: 'bot', text: data.text }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { sender: 'bot', text: "Erreur de connexion avec l'IA." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle lead capture form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !leadMessage) return;

    // Consent validation if CIL compliant
    if (site.isCILCompliant && (!consentCIL || !consentPartner)) {
      alert("Veuillez cocher les cases de consentement réglementaire pour autoriser le traitement de vos données conformément à la loi burkinabè.");
      return;
    }

    setIsSubmittingForm(true);

    try {
      const response = await fetch('/api/qualify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: site.id,
          name: leadName,
          phone: leadPhone,
          email: leadEmail,
          city: site.city,
          rawMessage: leadMessage,
          consentCILChecked: site.isCILCompliant ? consentCIL : true,
          consentPartnerChecked: site.isCILCompliant ? consentPartner : true
        })
      });
      const qualifiedLead = await response.json();
      setSubmissionSuccess(qualifiedLead);
      onLeadSubmitted(qualifiedLead);

      // Reset form
      setLeadName('');
      setLeadPhone('');
      setLeadEmail('');
      setLeadMessage('');
      setConsentCIL(false);
      setConsentPartner(false);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-950 w-full max-w-6xl h-[90vh] rounded-2xl flex flex-col overflow-hidden border border-slate-800 shadow-2xl">
        
        {/* Header containing meta indicators */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 min-w-0">
            <Smartphone className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] md:text-xs text-slate-400 font-mono block truncate">SIMULATION LIVE DE MICROSITE ACQUISITION</span>
              <h3 className="text-sm md:text-lg font-bold text-white flex items-center gap-2 truncate">
                <span className="truncate">{site.title}</span>
                <span className="text-[10px] md:text-xs bg-indigo-500/20 text-indigo-300 font-normal px-2.5 py-0.5 rounded-full border border-indigo-500/30 truncate hidden sm:inline-block">
                  {site.domain}
                </span>
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsChatbotOpen(!isChatbotOpen)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                isChatbotOpen 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs' 
                  : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 shadow-xs'
              }`}
              title={isChatbotOpen ? "Masquer l'assistant IA" : "Afficher l'assistant IA"}
            >
              <Bot className="w-4 h-4 animate-pulse" />
              <span className="hidden sm:inline">{isChatbotOpen ? "Masquer l'Assistant IA" : "Afficher l'Assistant IA"}</span>
              <span className="sm:hidden">{isChatbotOpen ? "Masquer IA" : "Afficher IA"}</span>
            </button>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Workspace split */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* LEFT COLUMN: Landing Page rendering */}
          {site.theme === 'solaire' ? (
            <div className="flex-1 bg-slate-950 overflow-y-auto text-slate-100 selection:bg-amber-500 selection:text-black scroll-smooth">
              
              {/* Header / Top Bar */}
              <div className="bg-slate-950 border-b border-slate-900 px-8 py-4 flex justify-between items-center sticky top-0 z-20 backdrop-blur-md bg-opacity-95 shadow-sm">
                <div className="flex items-center gap-2 text-amber-500 font-display font-black tracking-wide text-sm">
                  <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span>@solarafrica.design</span>
                </div>
                <nav className="hidden lg:flex items-center gap-6 text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">
                  <a href="#accueil" className="hover:text-amber-400 transition">Accueil</a>
                  <a href="#apropos" className="hover:text-amber-400 transition">À propos</a>
                  <a href="#services" className="hover:text-amber-400 transition">Nos Services</a>
                  <a href="#plan" className="hover:text-amber-400 transition">Plan de la Maison</a>
                  <a href="#devis-form" className="hover:text-amber-400 transition">Contact</a>
                </nav>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{site.city}, BF</span>
                </div>
              </div>

              {/* Hero Section */}
              <div className="relative overflow-hidden bg-slate-950 px-8 py-16 md:py-24 border-b border-slate-900" id="accueil">
                {/* Background glowing gradients */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative max-w-4xl mx-auto text-center space-y-8">
                  
                  <div className="space-y-1">
                    <h1 className="font-display text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.85]">
                      SOLARIS
                    </h1>
                    <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tight text-amber-500 flex items-center justify-center gap-2 leading-none">
                      AFRICA
                      <Globe className="w-8 h-8 md:w-12 md:h-12 text-amber-500 stroke-[3]" />
                    </h1>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-4">
                    <p className="text-slate-400 font-mono text-xs tracking-widest uppercase font-bold">
                      L'Énergie Solaire au service de votre confort
                    </p>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
                      {site.headline} — {site.subheadline}
                    </p>
                  </div>

                  <div className="pt-4">
                    <a 
                      href="#devis-form" 
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs tracking-wider uppercase px-8 py-4 rounded-xl transition shadow-xl shadow-amber-500/20"
                    >
                      <span>Demander un devis</span>
                      <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
                    </a>
                  </div>

                </div>
              </div>

              {/* Highlights bar */}
              <div className="px-8 py-6 bg-slate-900/40 border-b border-slate-900/80">
                <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3 hover:border-amber-500/30 transition">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Sun className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Énergie Solaire</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Propre et renouvelable</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3 hover:border-amber-500/30 transition">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Battery className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Autonomie</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Réduisez vos factures</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3 hover:border-amber-500/30 transition">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Home className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Confort Durable</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">À tout moment</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3 hover:border-amber-500/30 transition">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Leaf className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Impact Local</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Développement durable</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Section "NOS SERVICES" */}
              <div className="px-8 py-16 bg-slate-950 border-b border-slate-900" id="services">
                <div className="max-w-5xl mx-auto space-y-10">
                  
                  <div className="text-center space-y-1">
                    <span className="text-[10px] text-amber-500 font-mono uppercase font-bold tracking-widest block">Notre Expertise</span>
                    <h2 className="text-2xl font-display font-extrabold text-white uppercase tracking-tight">Nos Services</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-amber-500/20 transition space-y-4">
                      <span className="text-2xl font-black text-amber-500/40 block font-mono">01</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Étude & Conseil</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Analyse personnalisée de vos besoins énergétiques pour calibrer le système solaire idéal.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-amber-500/20 transition space-y-4">
                      <span className="text-2xl font-black text-amber-500/40 block font-mono">02</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Installation</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Mise en place de systèmes solaires certifiés, robustes et fiables avec des techniciens locaux qualifiés.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-amber-500/20 transition space-y-4">
                      <span className="text-2xl font-black text-amber-500/40 block font-mono">03</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Maintenance</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Suivi, nettoyage et entretien périodique pour maximiser la performance et la durée de vie des batteries.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-amber-500/20 transition space-y-4">
                      <span className="text-2xl font-black text-amber-500/40 block font-mono">04</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Accompagnement</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Nous vous guidons à chaque étape et formons vos équipes ou votre famille à l'utilisation du matériel.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* Section "PLAN DE LA MAISON" */}
              <div className="px-8 py-16 bg-slate-900/20 border-b border-slate-900" id="plan">
                <div className="max-w-5xl mx-auto space-y-8">
                  
                  <div className="text-center space-y-1">
                    <span className="text-[10px] text-amber-500 font-mono uppercase font-bold tracking-widest block">Simulation d'intégration</span>
                    <h2 className="text-2xl font-display font-extrabold text-white uppercase tracking-tight">Plan de la Maison</h2>
                    <p className="text-[11px] text-slate-400">Visualisez et estimez la couverture d'autonomie solaire pièce par pièce</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    
                    {/* Left Side: Table of rooms */}
                    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Surface Habitable</h3>
                        <span className="text-[10px] font-mono bg-amber-500/15 text-amber-500 font-bold px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
                          SURFACE TOTALE : 92 M²
                        </span>
                      </div>
                      
                      <div className="divide-y divide-slate-800/80 text-xs font-mono text-left">
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">Salon</span>
                          <span className="text-amber-500 font-bold">23,1 m²</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">Salle à manger</span>
                          <span className="text-amber-500 font-bold">13,3 m²</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">Cuisine</span>
                          <span className="text-amber-500 font-bold">8,6 m²</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">Chambre parentale</span>
                          <span className="text-amber-500 font-bold">15,0 m²</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">Chambre 1</span>
                          <span className="text-amber-500 font-bold">11,1 m²</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">Chambre 2</span>
                          <span className="text-amber-500 font-bold">9,0 m²</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">Salle de bain</span>
                          <span className="text-amber-500 font-bold">5,6 m²</span>
                        </div>
                        <div className="py-2.5 flex justify-between">
                          <span className="text-slate-400">Couloir & rangement</span>
                          <span className="text-amber-500 font-bold">7,4 m²</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Interactive SVG house layout plan */}
                    <div className="space-y-3">
                      <svg viewBox="0 0 400 300" className="w-full h-auto rounded-xl bg-slate-950 border border-slate-800/80 p-4 shadow-2xl">
                        <rect x="10" y="10" width="380" height="280" rx="12" fill="none" stroke="#334155" strokeWidth="4" />
                        
                        <rect x="15" y="15" width="180" height="120" fill="#0f172a" stroke="#334155" strokeWidth="2" className="hover:fill-amber-500/10 transition cursor-pointer" />
                        <text x="105" y="70" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">Salon</text>
                        <text x="105" y="88" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">23,1 m²</text>
                        
                        <rect x="195" y="15" width="100" height="120" fill="#0f172a" stroke="#334155" strokeWidth="2" className="hover:fill-amber-500/10 transition cursor-pointer" />
                        <text x="245" y="70" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">S. à manger</text>
                        <text x="245" y="88" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">13,3 m²</text>
                        
                        <rect x="295" y="15" width="90" height="120" fill="#0f172a" stroke="#334155" strokeWidth="2" className="hover:fill-amber-500/10 transition cursor-pointer" />
                        <text x="340" y="70" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">Cuisine</text>
                        <text x="340" y="88" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">8,6 m²</text>
                        
                        <rect x="15" y="135" width="140" height="150" fill="#0f172a" stroke="#334155" strokeWidth="2" className="hover:fill-amber-500/10 transition cursor-pointer" />
                        <text x="85" y="200" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">Chambre Par.</text>
                        <text x="85" y="218" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">15,0 m²</text>
                        
                        <rect x="155" y="135" width="120" height="80" fill="#0f172a" stroke="#334155" strokeWidth="2" className="hover:fill-amber-500/10 transition cursor-pointer" />
                        <text x="215" y="170" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">Chambre 1</text>
                        <text x="215" y="188" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">11,1 m²</text>
                        
                        <rect x="275" y="135" width="110" height="80" fill="#0f172a" stroke="#334155" strokeWidth="2" className="hover:fill-amber-500/10 transition cursor-pointer" />
                        <text x="330" y="170" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">Chambre 2</text>
                        <text x="330" y="188" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">9,0 m²</text>
                        
                        <rect x="155" y="215" width="120" height="70" fill="#0f172a" stroke="#334155" strokeWidth="2" className="hover:fill-amber-500/10 transition cursor-pointer" />
                        <text x="215" y="245" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">S. de bain</text>
                        <text x="215" y="263" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">5,6 m²</text>
                        
                        <rect x="275" y="215" width="110" height="70" fill="#0f172a" stroke="#334155" strokeWidth="2" className="hover:fill-amber-500/10 transition cursor-pointer" />
                        <text x="330" y="245" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">Générateur</text>
                        <text x="330" y="263" fill="#10b981" fontSize="9" textAnchor="middle">Solaire Active</text>
                      </svg>
                      <span className="text-[10px] text-slate-500 block text-center italic">Le toit de 92 m² peut accueillir jusqu'à 24 panneaux photovoltaïques.</span>
                    </div>

                  </div>

                </div>
              </div>

              {/* Form & Success State Section */}
              <div className="px-8 py-16 bg-slate-950 border-b border-slate-900" id="devis-form">
                <div className="max-w-2xl mx-auto">
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 md:p-8 relative">
                    {submissionSuccess ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-white mb-2">Demande Transmise !</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6">
                          Merci <strong>{submissionSuccess.name}</strong>. Votre demande de devis solaire a été analysée avec succès par l'intelligence artificielle.
                        </p>
                        
                        <div className="bg-slate-950 rounded-xl p-4 text-left border border-slate-800 text-xs space-y-2 mb-6 font-mono">
                          <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-850 pb-1.5 mb-1.5">
                            <span>RAPPORT DE QUALIFICATION SOLAIRE IA</span>
                            <span className="text-amber-500 font-bold">SCORE: {submissionSuccess.score}/100</span>
                          </div>
                          <p className="text-slate-300"><strong>Urgence :</strong> {submissionSuccess.urgency}</p>
                          <p className="text-slate-300"><strong>Budget évalué :</strong> {submissionSuccess.budget}</p>
                          <p className="text-slate-300"><strong>Besoin identifié :</strong> {submissionSuccess.summarizedNeed}</p>
                          <p className="text-amber-400/90 italic mt-2 bg-slate-900/40 p-2.5 rounded border border-amber-500/20 text-[11px] leading-relaxed text-left">
                            "Un partenaire local habilité vient de recevoir votre fiche et vous contactera d'ici quelques minutes sur le <strong>{submissionSuccess.phone}</strong>."
                          </p>
                        </div>

                        <button 
                          onClick={() => setSubmissionSuccess(null)}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition"
                        >
                          Soumettre une nouvelle demande
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                        <div className="space-y-1">
                          <h3 className="font-display text-lg font-bold text-white uppercase tracking-tight">
                            Demander une étude gratuite
                          </h3>
                          <p className="text-slate-400 text-xs">
                            Obtenez une réponse et un devis qualifié d'entreprises locales agréées à {site.city}.
                          </p>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Votre nom complet *</label>
                          <input 
                            type="text" 
                            required
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            placeholder="Ex: Moussa Traoré"
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Téléphone *</label>
                            <input 
                              type="tel" 
                              required
                              value={leadPhone}
                              onChange={(e) => setLeadPhone(e.target.value)}
                              placeholder="Ex: +226 70 00 00 00"
                              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Email (Optionnel)</label>
                            <input 
                              type="email" 
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                              placeholder="moussa@exemple.com"
                              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Quel est votre besoin énergétique ? *</label>
                          <textarea 
                            required
                            rows={3}
                            value={leadMessage}
                            onChange={(e) => setLeadMessage(e.target.value)}
                            placeholder="Ex: installation solaire autonome de 3kW pour une villa à Sarfalao, budget d'environ 1,5M FCFA..."
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition resize-none"
                          ></textarea>
                        </div>

                        {/* Conditional CIL Consent Section */}
                        {site.isCILCompliant ? (
                          <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3">
                            <div className="flex items-start gap-2.5">
                              <input 
                                type="checkbox" 
                                id="cilConsent-solar" 
                                required
                                checked={consentCIL}
                                onChange={(e) => setConsentCIL(e.target.checked)}
                                className="mt-1 h-3.5 w-3.5 text-amber-500 border-slate-800 rounded focus:ring-amber-500 cursor-pointer bg-slate-950"
                              />
                              <label htmlFor="cilConsent-solar" className="text-[10px] text-slate-400 font-medium leading-normal cursor-pointer select-none">
                                <strong className="text-amber-500">[Requis]</strong> J'autorise Solaris Africa à traiter mes coordonnées afin de qualifier mon besoin énergétique de manière automatisée.
                              </label>
                            </div>
                            <div className="flex items-start gap-2.5">
                              <input 
                                type="checkbox" 
                                id="partnerConsent-solar" 
                                required
                                checked={consentPartner}
                                onChange={(e) => setConsentPartner(e.target.checked)}
                                className="mt-1 h-3.5 w-3.5 text-amber-500 border-slate-800 rounded focus:ring-amber-500 cursor-pointer bg-slate-950"
                              />
                              <label htmlFor="partnerConsent-solar" className="text-[10px] text-slate-400 font-medium leading-normal cursor-pointer select-none">
                                <strong className="text-amber-500">[Requis]</strong> Je consens expressément à la transmission de ma fiche à un partenaire local qualifié de {site.city} sélectionné par l'IA.
                              </label>
                            </div>
                            <div className="text-[8px] text-slate-500 border-t border-slate-900 pt-1.5 mt-1 font-mono">
                              Conformité CIL (Burkina Faso) : Vos droits d'accès, de rectification et d'effacement de vos données personnelles sont entièrement garantis.
                            </div>
                          </div>
                        ) : (
                          <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl text-[10px] text-rose-300 flex items-start gap-2">
                            <span className="text-base leading-none">⚠️</span>
                            <p className="leading-normal font-mono text-[9px]">
                              <strong>AVERTISSEMENT :</strong> Ce site ne dispose pas de mentions explicites de consentement CIL. Vos données seront stockées sans chiffrement actif.
                            </p>
                          </div>
                        )}

                        <button 
                          type="submit" 
                          disabled={isSubmittingForm}
                          className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isSubmittingForm ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Analyse de charge IA en cours...</span>
                            </>
                          ) : (
                            <>
                              <span>Calculer mon devis gratuitement</span>
                            </>
                          )}
                        </button>
                        <p className="text-center text-[9px] text-slate-500 font-mono">
                          * Demande 100% gratuite et sans aucun engagement.
                        </p>
                      </form>
                    )}
                  </div>

                </div>
              </div>

              {/* FAQs Section */}
              <div className="bg-slate-950 px-8 py-16 border-b border-slate-900" id="faqs">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-500" />
                    <h2 className="font-display text-lg font-bold text-white uppercase tracking-tight text-left">Foire aux questions (FAQs)</h2>
                  </div>
                  <div className="space-y-4 text-left">
                    {(site.faqs || []).map((faq, index) => (
                      <div key={index} className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80">
                        <h4 className="font-semibold text-xs text-amber-500 uppercase tracking-wide mb-2">{faq.question}</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Localized Footer */}
              <div className="bg-slate-950 py-12 px-8 border-t border-slate-900/60">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-mono text-slate-400 text-left">
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <PhoneCall className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-[10px] uppercase text-slate-200">Appelez-nous</span>
                    </div>
                    <p className="text-xs text-white font-bold">+226 76 00 00 00</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Mail className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-[10px] uppercase text-slate-200">Email</span>
                    </div>
                    <p className="text-xs text-white font-bold">contact@solarafrica.bf</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-[10px] uppercase text-slate-200">Localisation</span>
                    </div>
                    <p className="text-xs text-white font-bold">Ouagadougou, Burkina Faso</p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-[10px] uppercase text-slate-200 block">Suivez-nous</span>
                    <div className="flex gap-3 text-slate-400">
                      <a href="#" className="hover:text-amber-500 transition"><Facebook className="w-4 h-4" /></a>
                      <a href="#" className="hover:text-amber-500 transition"><Instagram className="w-4 h-4" /></a>
                      <a href="#" className="hover:text-amber-500 transition"><Linkedin className="w-4 h-4" /></a>
                      <a href="#" className="hover:text-amber-500 transition"><Youtube className="w-4 h-4" /></a>
                    </div>
                  </div>

                </div>

                <div className="border-t border-slate-900/60 mt-8 pt-8 text-center text-slate-500 space-y-1.5">
                  <p className="text-[10px] font-bold text-amber-500/80">SOLARIS AFRICA, L'ÉNERGIE D'UN AVENIR MEILLEUR</p>
                  <p className="text-[9px]">© 2026 {site.title} • {site.city}, Burkina Faso.</p>
                  <p className="text-[9px]">Canal d'acquisition officiel propulsé de manière autonome par LeadFactory Africa AI.</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 bg-white overflow-y-auto">
              
              {/* Local Brand Top Bar */}
              <div className="border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 bg-white z-10 shadow-xs">
                <div className="flex items-center gap-2 font-display font-bold text-slate-800 text-lg">
                  {styles.icon}
                  <span>{site.title}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{site.city}, Burkina Faso</span>
                </div>
              </div>

              {/* Hero Section */}
              <div className="px-8 py-12 md:py-16 text-center max-w-3xl mx-auto">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles.bgLight} ${styles.text} border ${styles.border} mb-6`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mise en relation directe certifiée IA</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                  {site.headline}
                </h1>
                <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                  {site.subheadline}
                </p>
              </div>

              {/* Main Content Layout: Form & Selling Points */}
              <div className="px-8 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                
                {/* Selling features list */}
                <div className="space-y-6 flex flex-col justify-center text-left">
                  <h2 className="font-display text-xl font-bold text-slate-800 mb-2">
                    Pourquoi nous faire confiance ?
                  </h2>
                  <div className="space-y-5">
                    {(site.features || []).map((feature, i) => (
                      <div key={i} className="flex gap-3.5">
                        <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${styles.bgLight} ${styles.text}`}>
                          <CheckCircle className="w-4.5 h-4.5" />
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{feature}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4 text-left">
                    <Bot className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-slate-800 font-bold text-xs">Qualification instantanée par IA</h4>
                      <p className="text-slate-500 text-xs leading-relaxed mt-1">
                        Votre demande est analysée par notre IA pour cibler l'artisan ou l'entreprise burkinabè la plus qualifiée à {site.city}, sans intermédiaire ni frais cachés.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form & Success State */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-8 relative text-left">
                  {submissionSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-slate-800 mb-2">Demande Transmise !</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        Merci <strong>{submissionSuccess.name}</strong>. Votre demande d'acquisition a été analysée avec succès par l'intelligence artificielle.
                      </p>
                      
                      {/* Simulated IA report displayed to public for high-fidelity engagement */}
                      <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 text-xs space-y-2 mb-6">
                        <div className="flex justify-between font-mono text-[10px] text-slate-400 border-b border-slate-200 pb-1.5 mb-1.5">
                          <span>RAPPORT DE QUALIFICATION IA</span>
                          <span className="text-indigo-600 font-bold">SCORE: {submissionSuccess.score}/100</span>
                        </div>
                        <p className="text-slate-700"><strong>Urgence :</strong> {submissionSuccess.urgency}</p>
                        <p className="text-slate-700"><strong>Budget évalué :</strong> {submissionSuccess.budget}</p>
                        <p className="text-slate-700"><strong>Besoin identifié :</strong> {submissionSuccess.summarizedNeed}</p>
                        <p className="text-slate-500 italic mt-2 bg-white p-2 rounded border border-slate-100 text-left">
                          "Un partenaire local habilité vient de recevoir votre fiche et vous contactera d'ici quelques minutes sur le <strong>{submissionSuccess.phone}</strong>."
                        </p>
                      </div>

                      <button 
                        onClick={() => setSubmissionSuccess(null)}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition cursor-pointer ${styles.primary}`}
                      >
                        Soumettre une nouvelle demande
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <h3 className="font-display text-lg font-bold text-slate-800 mb-1">
                        Demander une étude gratuite
                      </h3>
                      <p className="text-slate-500 text-xs mb-4">
                        Obtenez une réponse et un devis qualifié d'entreprises locales à {site.city}.
                      </p>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Votre nom complet *</label>
                        <input 
                          type="text" 
                          required
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="Ex: Moussa Traoré"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-800 transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Téléphone *</label>
                          <input 
                            type="tel" 
                            required
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            placeholder="Ex: +226 70 00 00 00"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-800 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Email (Optionnel)</label>
                          <input 
                            type="email" 
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            placeholder="moussa@exemple.com"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-800 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Quel est votre besoin ? *</label>
                        <textarea 
                          required
                          rows={3}
                          value={leadMessage}
                          onChange={(e) => setLeadMessage(e.target.value)}
                          placeholder="Soyez le plus précis possible (ex: installation solaire de 3kW, budget d'environ 1M, pour une maison à Sarfalao...)"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-800 transition resize-none"
                        ></textarea>
                      </div>

                      {/* Conditional CIL Consent Section */}
                      {site.isCILCompliant ? (
                        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-3">
                          <div className="flex items-start gap-2.5">
                            <input 
                              type="checkbox" 
                              id="cilConsent" 
                              required
                              checked={consentCIL}
                              onChange={(e) => setConsentCIL(e.target.checked)}
                              className="mt-0.5 h-3.5 w-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor="cilConsent" className="text-[11px] text-slate-600 font-medium leading-normal cursor-pointer select-none">
                              <strong>[Requis]</strong> J'autorise LeadFactory Africa AI à traiter mes coordonnées afin de qualifier mon besoin de manière automatisée.
                            </label>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <input 
                              type="checkbox" 
                              id="partnerConsent" 
                              required
                              checked={consentPartner}
                              onChange={(e) => setConsentPartner(e.target.checked)}
                              className="mt-0.5 h-3.5 w-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor="partnerConsent" className="text-[11px] text-slate-600 font-medium leading-normal cursor-pointer select-none">
                              <strong>[Requis]</strong> Je consens expressément à la transmission de ma fiche à un entreprise locale qualifiée de {site.city} sélectionnée par l'IA.
                            </label>
                          </div>
                          <div className="text-[9px] text-slate-400 border-t border-slate-200 pt-1.5 mt-1 font-mono">
                            Conformité CIL (Burkina Faso) : Vous disposez d'un droit d'accès, de retrait de consentement et de suppression de vos données sur simple demande.
                          </div>
                        </div>
                      ) : (
                        <div className="bg-rose-50 border border-rose-150 p-3 rounded-xl text-[11px] text-rose-800 flex items-start gap-2">
                          <span className="text-base leading-none">⚠️</span>
                          <p className="leading-normal">
                            <strong>Avertissement Réglementaire :</strong> Ce microsite ne dispose pas de mentions de consentement explicite. Vos données seront collectées de manière directe sans protection CIL active.
                          </p>
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={isSubmittingForm}
                        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${styles.primary} disabled:opacity-50`}
                      >
                        {isSubmittingForm ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Qualification IA en cours...</span>
                          </>
                        ) : (
                          <>
                            <span>Envoyer ma demande gratuite</span>
                          </>
                        )}
                      </button>
                      <p className="text-center text-[10px] text-slate-400">
                        * Vos données sont transmises de manière sécurisée aux entreprises partenaires.
                      </p>
                    </form>
                  )}
                </div>

              </div>

              {/* FAQs Section */}
              <div className="bg-slate-50 px-8 py-12 border-t border-slate-100">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-slate-600" />
                    <h2 className="font-display text-xl font-bold text-slate-800">Foire aux questions (FAQs)</h2>
                  </div>
                  <div className="space-y-4">
                    {(site.faqs || []).map((faq, index) => (
                      <div key={index} className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs">
                        <h4 className="font-semibold text-sm text-slate-800 mb-2">{faq.question}</h4>
                        <p className="text-slate-500 text-xs leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Localized Footer */}
              <div className="border-t border-slate-100 py-8 px-8 text-center text-slate-400 text-xs">
                <p>© 2026 {site.title} - Bobo-Dioulasso, Burkina Faso.</p>
                <p className="mt-1 text-slate-400">Canal d'acquisition officiel propulsé de manière autonome par LeadFactory Africa AI.</p>
              </div>

            </div>
          )}

          {/* RIGHT COLUMN: Interactive Chatbot Assist Widget */}
          {isChatbotOpen && (
            <div className="w-full md:w-[380px] bg-slate-900 border-l border-slate-800 flex flex-col justify-between shrink-0 absolute inset-y-0 right-0 md:relative z-30 shadow-2xl md:shadow-none">
              
              {/* Chatbot Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
                      <Bot className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold flex items-center gap-1">
                      Assistant Local IA
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-normal">EN LIGNE</span>
                    </h4>
                    <p className="text-slate-400 text-[10px] mt-0.5 truncate max-w-[180px]">
                      Configuré pour {site.title}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatbotOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-850 transition"
                  title="Masquer l'assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            {/* Chatbot History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-slate-800 text-white rounded-br-none' 
                      : 'bg-indigo-950/40 text-indigo-100 rounded-bl-none border border-indigo-900/40'
                  }`}>
                    {msg.sender === 'bot' && (
                      <span className="block font-mono text-[9px] text-indigo-400 mb-1 font-bold">ASSISTANT IA</span>
                    )}
                    <p className="whitespace-pre-line text-xs">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-indigo-950/30 border border-indigo-900/30 rounded-2xl rounded-bl-none p-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span className="text-indigo-300 text-xs font-medium">L'IA réfléchit...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chatbot input panel */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
              <input 
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Posez une question en français..."
                className="flex-1 bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition"
              />
              <button 
                type="submit" 
                disabled={!chatMessage.trim() || isChatLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition disabled:opacity-40 disabled:hover:bg-indigo-600 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
          )}

        </div>

      </div>
    </div>
  );
}
