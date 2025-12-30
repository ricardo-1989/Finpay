
import React, { useState, useMemo, useEffect } from 'react';

const KanbanBoard: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [filterText, setFilterText] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterOrigin, setFilterOrigin] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [leadToDelete, setLeadToDelete] = useState<any>(null);

  useEffect(() => {
    const savedLeads = localStorage.getItem('finpay_leads');
    if (savedLeads) setLeads(JSON.parse(savedLeads));
  }, []);

  const origins = Array.from(new Set(leads.map(lead => lead.tag)));
  const statuses = ['Novo', 'Em Negociação', 'Fechado', 'Perdido'];

  const filteredLeads = useMemo(() => {
    let result = [...leads];
    const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (filterText) {
      const normalizedSearch = normalizeString(filterText);
      result = result.filter(lead => 
        normalizeString(lead.name).includes(normalizedSearch) || 
        normalizeString(lead.lot || "").includes(normalizedSearch)
      );
    }

    if (filterStatus) result = result.filter(lead => lead.status === filterStatus);

    return result;
  }, [leads, filterText, filterStatus]);

  const getColumnData = (status: string) => filteredLeads.filter(l => l.status === status);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light dark:bg-slate-900 transition-colors">
      <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-3 md:px-6 shrink-0 z-10 transition-colors">
         <div className="flex items-center gap-2 md:gap-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Funil de Vendas</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400 hidden lg:block">{leads.length} leads registrados</div>
         </div>
         <div className="flex items-center gap-2">
            <button className="bg-primary hover:bg-[#0b2b2c] text-white px-3 md:px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                <span className="material-symbols-outlined text-[20px]">add</span> Novo Lead
            </button>
         </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden p-3 md:p-6 relative">
        {leads.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
             <span className="material-symbols-outlined text-6xl mb-4">groups_2</span>
             <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">Funil Vazio</h3>
             <p className="max-w-xs text-center mt-2">Você ainda não possui leads cadastrados. Comece adicionando prospectos para gerenciar sua jornada de vendas.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2 snap-x snap-mandatory no-scrollbar">
            <div className="flex gap-3 md:gap-6 px-1 min-w-full h-full items-start">
              {statuses.map(status => (
                <Column key={status} title={status} count={getColumnData(status).length} color={status === 'Novo' ? 'bg-blue-500' : status === 'Fechado' ? 'bg-emerald-500' : 'bg-amber-500'}>
                   {getColumnData(status).map(lead => <Card key={lead.id} {...lead} />)}
                </Column>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Column: React.FC<{title: string, count: number, color: string, children: React.ReactNode}> = ({title, count, color, children}) => (
    <div className="flex-1 min-w-[85vw] sm:min-w-[320px] flex flex-col h-full bg-[#E8EEF5] dark:bg-slate-800 rounded-xl p-2 border border-transparent transition-colors snap-center">
        <div className="flex items-center justify-between px-2 py-3 mb-2">
            <div className="flex items-center gap-2">
                <div className={`size-3 rounded-full ${color}`}></div>
                <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm uppercase tracking-wide">{title}</h3>
                <span className="bg-white/50 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar pb-14">{children}</div>
    </div>
);

const Card: React.FC<any> = ({ name, lot, price }) => (
  <div className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-600">
      <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">{name}</h4>
      <p className="text-sm text-slate-500 dark:text-gray-300">{lot || 'Lote não definido'}</p>
      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2">R$ {price?.toLocaleString('pt-BR') || "0,00"}</p>
  </div>
);

export default KanbanBoard;
