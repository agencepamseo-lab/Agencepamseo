import React, { useState } from 'react';
import { Site, Lead } from '../types';
import { 
  Sun, GraduationCap, Building, Droplets, Leaf, 
  Send, Bot, HelpCircle, CheckCircle, Smartphone, 
  Globe, PhoneCall, Mail, MapPin, Sparkles, Loader2, X
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
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="text-xs text-slate-400 font-mono">SIMULATION LIVE DE MICROSITE ACQUISITION</span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {site.title}
                <span className="text-xs bg-indigo-500/20 text-indigo-300 font-normal px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  {site.domain}
                </span>
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Workspace split */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT COLUMN: Landing Page rendering */}
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
              <div className="space-y-6 flex flex-col justify-center">
                <h2 className="font-display text-xl font-bold text-slate-800 mb-2">
                  Pourquoi nous faire confiance ?
                </h2>
                <div className="space-y-5">
                  {site.features.map((feature, i) => (
                    <div key={i} className="flex gap-3.5">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${styles.bgLight} ${styles.text}`}>
                        <CheckCircle className="w-4.5 h-4.5" />
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
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
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-8 relative">
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
                      <p className="text-slate-500 italic mt-2 bg-white p-2 rounded border border-slate-100">
                        "Un partenaire local habilité vient de recevoir votre fiche et vous contactera d'ici quelques minutes sur le <strong>{submissionSuccess.phone}</strong>."
                      </p>
                    </div>

                    <button 
                      onClick={() => setSubmissionSuccess(null)}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition ${styles.primary}`}
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
                            <strong>[Requis]</strong> Je consens expressément à la transmission de ma fiche à une entreprise locale qualifiée de {site.city} sélectionnée par l'IA.
                          </label>
                        </div>
                        <div className="text-[9px] text-slate-400 border-t border-slate-200 pt-1.5 mt-1">
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
                      className={`w-full py-3.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${styles.primary} disabled:opacity-50`}
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
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                  <HelpCircle className="w-5 h-5 text-slate-600" />
                  <h2 className="font-display text-xl font-bold text-slate-800">Foire aux questions (FAQs)</h2>
                </div>
                <div className="space-y-4">
                  {site.faqs.map((faq, index) => (
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

          {/* RIGHT COLUMN: Interactive Chatbot Assist Widget */}
          <div className="w-[380px] bg-slate-900 border-l border-slate-800 flex flex-col justify-between">
            
            {/* Chatbot Header */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
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
                <p className="text-slate-400 text-[10px] mt-0.5 truncate max-w-[200px]">
                  Configuré pour {site.title}
                </p>
              </div>
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

        </div>

      </div>
    </div>
  );
}
