
import React, { useState, useEffect } from 'react';

const initialDevelopmentsData = [
  { 
    id: 1, 
    name: 'CHÁCARAS GIRASSOL', 
    location: 'REGIÃO NORTE', 
    totalLots: 120, 
    available: 45, 
    sold: 75, 
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800' 
  },
  { 
    id: 2, 
    name: 'CHÁCARAS INHUMAS', 
    location: 'SAÍDA OESTE', 
    totalLots: 200, 
    available: 32, 
    sold: 168, 
    image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=800' 
  },
  { 
    id: 3, 
    name: 'CHÁCARAS NOVA OLINDA', 
    location: 'DISTRITO INDUSTRIAL', 
    totalLots: 150, 
    available: 12, 
    sold: 138, 
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800' 
  },
  { 
    id: 4, 
    name: 'CHÁCARAS ALDEIAS', 
    location: 'ZONA RURAL SUL', 
    totalLots: 80, 
    available: 5, 
    sold: 75, 
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800' 
  },
  { 
    id: 5, 
    name: 'CHÁCARAS DONA OLGA', 
    location: 'PRÓXIMO AO CENTRO', 
    totalLots: 100, 
    available: 18, 
    sold: 82, 
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800' 
  },
  { 
    id: 6, 
    name: 'CHÁCARAS JABUTI', 
    location: 'REGIÃO LESTE', 
    totalLots: 90, 
    available: 22, 
    sold: 68, 
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800' 
  },
  { 
    id: 7, 
    name: 'CHÁCARAS VITÓRIA', 
    location: 'NOVA EXPANSAO', 
    totalLots: 300, 
    available: 145, 
    sold: 155, 
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800' 
  },
  { 
    id: 8, 
    name: 'CHÁCARAS BOM JARDIM', 
    location: 'VALE DAS ÁGUAS', 
    totalLots: 110, 
    available: 28, 
    sold: 82, 
    image: 'https://images.unsplash.com/photo-1418489098061-ce87b5dc3aee?q=80&w=800' 
  },
];

const Developments: React.FC = () => {
  const [developments, setDevelopments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDev, setNewDev] = useState({ name: '', location: '', total: '' });

  useEffect(() => {
    const saved = localStorage.getItem('finpay_developments');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length === initialDevelopmentsData.length) {
        const merged = parsed.map((dev: any, index: number) => ({
          ...dev,
          image: initialDevelopmentsData[index].image
        }));
        setDevelopments(merged);
        localStorage.setItem('finpay_developments', JSON.stringify(merged));
      } else {
        setDevelopments(parsed);
      }
    } else {
      setDevelopments(initialDevelopmentsData);
      localStorage.setItem('finpay_developments', JSON.stringify(initialDevelopmentsData));
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if(newDev.name && newDev.total) {
        const dev = {
            id: Date.now(),
            name: newDev.name.toUpperCase(),
            location: newDev.location.toUpperCase() || 'NÃO INFORMADO',
            totalLots: parseInt(newDev.total),
            available: parseInt(newDev.total),
            sold: 0,
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800'
        };
        const updated = [...developments, dev];
        setDevelopments(updated);
        localStorage.setItem('finpay_developments', JSON.stringify(updated));
        setNewDev({ name: '', location: '', total: '' });
        setIsModalOpen(false);
    }
  };

  return (
    <div className="flex-1 w-full p-4 md:p-8 overflow-y-auto bg-background-light dark:bg-[#0b101b] transition-colors relative">
       <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Empreendimentos</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Sua carteira imobiliária com fotos reais da natureza.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-[#0b2b2c] text-white px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95">
             <span className="material-symbols-outlined">add</span> Novo Empreendimento
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {developments.map(dev => (
            <div key={dev.id} className="bg-white dark:bg-[#1e293b] rounded-[2rem] overflow-hidden shadow-xl border-2 border-secondary/30 dark:border-secondary/20 group flex flex-col transition-all hover:scale-[1.02] hover:border-secondary">
               <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  <img 
                    src={dev.image} 
                    alt={dev.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                     <h3 className="font-black text-lg leading-tight uppercase tracking-tight drop-shadow-md">{dev.name}</h3>
                     <p className="text-[10px] opacity-80 flex items-center gap-1 mt-1 font-bold tracking-widest uppercase">
                        <span className="material-symbols-outlined text-[14px]">location_on</span> {dev.location}
                     </p>
                  </div>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-6 bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                     <div className="text-center flex-1 border-r border-slate-200 dark:border-white/10">
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest mb-1">Total</span>
                        <span className="block text-2xl font-black text-slate-900 dark:text-white">{dev.totalLots}</span>
                     </div>
                     <div className="text-center flex-1">
                        <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-black tracking-widest mb-1">Livres</span>
                        <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">{dev.available}</span>
                     </div>
                  </div>
                  <button className="mt-auto w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-secondary/10 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-white flex items-center justify-center gap-2 transition-all active:scale-95 group-hover:border-secondary group-hover:text-secondary">
                     <span className="material-symbols-outlined text-[18px]">map</span> Mapa do Loteamento
                  </button>
               </div>
            </div>
          ))}
       </div>

       {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up border border-white/10">
              <div className="p-8 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Novo Empreendimento</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
              </div>
              <form onSubmit={handleAdd} className="p-8 space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Nome do Loteamento</label>
                    <input value={newDev.name} onChange={e => setNewDev({...newDev, name: e.target.value})} type="text" className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 border text-sm outline-none dark:text-white focus:border-secondary transition-all" placeholder="Ex: RESIDENCIAL COLINAS" required />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Localização</label>
                    <input value={newDev.location} onChange={e => setNewDev({...newDev, location: e.target.value})} type="text" className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 border text-sm outline-none dark:text-white focus:border-secondary transition-all" placeholder="Ex: REGIÃO SUL" required />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Total de Lotes</label>
                    <input value={newDev.total} onChange={e => setNewDev({...newDev, total: e.target.value})} type="number" className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 border text-sm outline-none dark:text-white focus:border-secondary transition-all" placeholder="Quantidade total" required />
                 </div>
                 <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-500 font-bold text-sm">Cancelar</button>
                    <button type="submit" className="flex-1 py-4 bg-secondary text-white rounded-2xl font-black text-sm shadow-xl shadow-secondary/20">Salvar Dados</button>
                 </div>
              </form>
           </div>
         </div>
       )}
    </div>
  );
};

export default Developments;
