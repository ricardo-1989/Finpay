
import React, { useState, useEffect } from 'react';

interface SmartQueueProps {
  onOpenWhatsApp: () => void;
}

const SmartQueue: React.FC<SmartQueueProps> = ({ onOpenWhatsApp }) => {
  const [prioritizedList, setPrioritizedList] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('finpay_clients');
    if (saved) {
      const clients = JSON.parse(saved).filter((c: any) => c.status === 'Atrasado');
      const prioritized = clients.map((c: any) => ({
        ...c,
        priorityLabel: 'Crítica',
        iaInsight: 'Detectado atraso em dados reais. Recomenda-se envio imediato de notificação para regularização do fluxo de caixa.'
      }));
      setPrioritizedList(prioritized);
    } else {
      setPrioritizedList([]);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f1a] overflow-y-auto p-4 md:p-12 transition-colors pb-32">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-10">
        <div className="flex items-start gap-5">
           <div className="size-16 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
              <span className="material-symbols-outlined text-4xl text-orange-500 animate-pulse">bolt</span>
           </div>
           <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Fila Inteligente</h1>
              <p className="text-slate-400 mt-2 text-lg">Priorização estratégica baseada na sua carteira real.</p>
           </div>
        </div>

        {prioritizedList.length === 0 ? (
          <div className="py-32 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center">
             <span className="material-symbols-outlined text-6xl text-slate-700 mb-4 opacity-30">checklist_rtl</span>
             <p className="text-xl font-bold text-slate-500">Nenhum atraso real detectado.</p>
             <p className="text-slate-600 mt-1 max-w-sm mx-auto">Sua carteira está 100% em dia ou ainda não foram cadastrados clientes reais.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
             {prioritizedList.map((client) => (
                <div key={client.id} className="bg-white/5 rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden">
                   <div className="absolute left-0 top-0 w-1.5 h-full bg-rose-500"></div>
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                         <h3 className="text-2xl font-black text-white leading-tight">{client.name}</h3>
                         <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-400">Alta Prioridade</span>
                      </div>
                      <div className="flex gap-6 text-sm text-slate-400">
                         <span className="font-bold text-white/90">{client.val}</span>
                         <span className="text-rose-500 font-bold">{client.parcel}</span>
                      </div>
                   </div>
                   <div className="md:max-w-xs bg-black/40 p-5 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-orange-400 font-black uppercase mb-1 tracking-widest">IA Insight</p>
                      <p className="text-sm text-slate-300 leading-relaxed italic">"{client.iaInsight}"</p>
                   </div>
                   <button onClick={onOpenWhatsApp} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl transition-all">
                      <span className="material-symbols-outlined">chat</span> Cobrar
                   </button>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartQueue;
