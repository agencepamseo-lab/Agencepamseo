import React, { useState } from 'react';
import { SecurityEvent } from '../types';
import { 
  ShieldAlert, ShieldCheck, Database, RefreshCw, Key, Lock, 
  Terminal, Server, FileText, CheckCircle2, AlertOctagon 
} from 'lucide-react';

interface AgentSecurityProps {
  securityEvents: SecurityEvent[];
  onTriggerBackup: () => Promise<{ success: boolean; backupId: string; timestamp: string } | null>;
}

export default function AgentSecurity({ securityEvents, onTriggerBackup }: AgentSecurityProps) {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<{ id: string; timestamp: string } | null>(null);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const result = await onTriggerBackup();
      if (result && result.success) {
        setLastBackup({ id: result.backupId, timestamp: result.timestamp });
        alert(`Sauvegarde réussie !\nID : ${result.backupId}\nLes données prospects et le registre CIL ont été chiffrés AES-256 de bout-en-bout.`);
      }
    } catch (error) {
      console.error("Backup failed:", error);
    } finally {
      setIsBackingUp(false);
    }
  };

  const getSeverityBadge = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'info':
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[9px] px-2 py-0.5 rounded-sm font-mono uppercase">Info</span>;
      case 'warning':
        return <span className="bg-amber-950 text-amber-400 border border-amber-900 text-[9px] px-2 py-0.5 rounded-sm font-mono uppercase font-bold">Warning</span>;
      case 'critical':
        return <span className="bg-red-950 text-rose-400 border border-red-900 text-[9px] px-2 py-0.5 rounded-sm font-mono uppercase font-bold animate-pulse">Critical</span>;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Upper header section for Security */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-rose-400" />
            <h2 className="text-xl font-display font-extrabold text-white">Agent Sécurité IA</h2>
          </div>
          <p className="text-slate-400 text-xs mt-1.5 max-w-xl">
            Ce module surveille en permanence la sécurité de l'infrastructure d'acquisition. Il détecte les comportements anormaux, assure le chiffrement des données de prospects et effectue des sauvegardes centralisées cryptées.
          </p>
        </div>

        {/* Trigger secure backup button */}
        <button 
          onClick={handleBackup}
          disabled={isBackingUp}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md shadow-rose-600/10 disabled:opacity-50"
        >
          {isBackingUp ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-rose-200" />
              <span>Chiffrement & Sauvegarde...</span>
            </>
          ) : (
            <>
              <Database className="w-4 h-4 text-rose-200" />
              <span>Lancer Sauvegarde Chiffrée (CIL)</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: Last backup and logs timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Security status card and last backup */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-xs">
            <h3 className="text-slate-800 font-display font-bold text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Server className="w-4.5 h-4.5 text-indigo-500" />
              État de la sécurité système
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Contrôle anti-injection</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Actif
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Algorithme de cryptage</span>
                <span className="text-slate-700 font-bold font-mono">AES-256-GCM</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Sandboxing des prospects</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Sécurisé
                </span>
              </div>
            </div>
          </div>

          {lastBackup && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                <span>Rapport de Sauvegarde Récente</span>
              </div>
              <div className="text-[11px] text-slate-600 font-mono space-y-1">
                <p><strong>ID :</strong> <span className="text-slate-800 select-all">{lastBackup.id}</span></p>
                <p><strong>Fait à :</strong> {new Date(lastBackup.timestamp).toLocaleTimeString('fr-FR')} (Heure de Bobo)</p>
                <p className="text-emerald-700 font-sans italic mt-1 font-semibold">
                  Sûreté : 100% des données des prospects locaux ont été chiffrées sur le serveur central.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Right column: Security alerts timeline */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-900 text-slate-300 p-6 space-y-4 font-mono shadow-xl">
          <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-rose-500" />
              Security Events Registry (Security Guardian Logs)
            </h4>
            <span className="bg-rose-500/10 text-rose-400 text-[9px] font-bold px-2 py-0.5 rounded">
              VEILLE ACTIVE
            </span>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 text-[11px] leading-relaxed">
            {securityEvents.map((event) => (
              <div key={event.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-900 space-y-2">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-slate-500 text-[10px] shrink-0">
                    {new Date(event.timestamp).toLocaleTimeString('fr-FR')} - {new Date(event.timestamp).toLocaleDateString('fr-FR')}
                  </span>
                  {getSeverityBadge(event.severity)}
                </div>
                <p className="text-slate-300">
                  {event.description}
                </p>
              </div>
            ))}

            {securityEvents.length === 0 && (
              <div className="py-12 text-center text-slate-500 italic">
                Aucun incident de sécurité enregistré. Le système d'acquisition autonome est entièrement protégé.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
