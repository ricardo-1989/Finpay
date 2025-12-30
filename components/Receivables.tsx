
import React, { useState, useEffect } from 'react';

const Receivables: React.FC<{onOpenWhatsApp: (clientId: number) => void}> = ({onOpenWhatsApp}) => {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('finpay_clients');
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      setClients([]);
    }
  }, []);

  const receivables = clients.filter(c => c.status !== 'Pago');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F2F5F7] dark:bg-slate-900 overflow-y-auto p-4 md:p-10 transition-colors">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
         <div>
            <div className="flex items-center gap-3">
               <h1 className="text-primary dark:text-white text-3xl font-black leading-tight tracking-tight">Contas a Receber</h1>
               <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase border border-secondary/20">Ambiente Real</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Todas as parcelas em atraso ou a vencer de seus clientes reais.</p>
         </div>

         <div className="grid grid-cols-1 gap-4">
            {receivables.length > 0 ? receivables.map(c => (
              <ReceivableCard 
                 key={c.id}
                 id={c.id}
                 initials={c.initials} 
                 name={c.name} 
                 location={c.lot} 
                 val={c.val} 
                 status={`Vencimento: ${c.date}`}
                 onWhatsApp={onOpenWhatsApp}
              />
            )) : (
              <div className="py-20 text-center bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400">
                 <span className="material-symbols-outlined text-5xl mb-3 opacity-20">fact_check</span>
                 <p className="font-bold text-slate-600 dark:text-slate-300">Sem pendências reais.</p>
                 <p className="text-sm mt-1">Quando você cadastrar clientes com parcelas em aberto, elas aparecerão aqui automaticamente.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

const ReceivableCard = ({id, initials, name, location, val, status, onWhatsApp}: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-l-4 border-l-secondary border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group transition-colors">
     <div className="flex items-start gap-4 flex-1">
        <div className={`bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white rounded-lg size-12 flex items-center justify-center shrink-0 border border-white dark:border-slate-600 shadow-sm font-bold text-lg uppercase`}>{initials}</div>
        <div className="flex flex-col">
           <h3 className="text-slate-900 dark:text-white font-bold text-lg">{name}</h3>
           <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span>{location}</span>
           </div>
        </div>
     </div>
     <div className="flex flex-col items-start md:items-end gap-1 min-w-[140px]">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</p>
        <p className="text-slate-900 dark:text-white text-xl font-black">{val}</p>
        <p className="text-secondary text-sm font-bold flex items-center gap-1">
           <span className="material-symbols-outlined text-[16px] filled">warning</span> {status}
        </p>
     </div>
     <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
        <button onClick={() => onWhatsApp(id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-whatsapp hover:bg-[#1da851] text-white rounded-lg font-black transition-colors shadow-sm">
           <span className="material-symbols-outlined text-[18px]">chat</span> WhatsApp
        </button>
     </div>
  </div>
);

export default Receivables;
