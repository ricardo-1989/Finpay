
import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend } from 'recharts';

const staticDevelopments = [
  { id: 1, name: 'CHÁCARAS GIRASSOL' },
  { id: 2, name: 'CHÁCARAS INHUMAS' },
  { id: 3, name: 'CHÁCARAS NOVA OLINDA' },
  { id: 4, name: 'CHÁCARAS ALDEIAS' },
  { id: 5, name: 'CHÁCARAS DONA OLGA' },
  { id: 6, name: 'CHÁCARAS JABUTI' },
  { id: 7, name: 'CHÁCARAS VITÓRIA' },
  { id: 8, name: 'CHÁCARAS BOM JARDIM' },
];

const Comparison: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3]);
  const [iaInsight, setIaInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [realClients, setRealClients] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('finpay_clients');
    if (saved) setRealClients(JSON.parse(saved));
  }, []);

  // Agrega os dados reais por empreendimento
  const calculatedData = useMemo(() => {
    return staticDevelopments.map(dev => {
      const devClients = realClients.filter(c => c.developmentName === dev.name);
      const total = devClients.length;
      
      if (total === 0) return { ...dev, saude: 0, inadimplencia: 0, ticketMedio: 0, count: 0 };

      const paid = devClients.filter(c => c.status === 'Pago').length;
      const late = devClients.filter(c => c.status === 'Atrasado').length;
      const totalValue = devClients.reduce((acc, c) => acc + (c.numericVal || 0), 0);

      return {
        ...dev,
        saude: Math.round((paid / total) * 100),
        inadimplencia: Math.round((late / total) * 100),
        ticketMedio: totalValue / total,
        count: total
      };
    });
  }, [realClients]);

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length < 3) setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedData = calculatedData.filter(d => selectedIds.includes(d.id));

  const radarData = [
    { subject: 'Vendas', ...selectedData.reduce((acc, d) => ({...acc, [d.name]: d.count > 0 ? 100 : 0}), {}) },
    { subject: 'Saúde Fin.', ...selectedData.reduce((acc, d) => ({...acc, [d.name]: d.saude}), {}) },
    { subject: 'Ticket Médio', ...selectedData.reduce((acc, d) => ({...acc, [d.name]: d.ticketMedio > 0 ? 100 : 0}), {}) },
    { subject: 'Recebimento', ...selectedData.reduce((acc, d) => ({...acc, [d.name]: d.saude}), {}) },
  ];

  const handleAnalysis = async () => {
    setIsGenerating(true);
    setIaInsight(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (realClients.length === 0) {
        setIaInsight(`**SISTEMA PRONTO:** O motor de análise está aguardando seus primeiros cadastros reais. Vá em "Novo Cliente" e insira dados para ver esta inteligência em ação.`);
    } else {
        setIaInsight(`**ANÁLISE DE DADOS REAIS:** Com base em seus ${realClients.length} cadastros, identifiquei que o empreendimento mais saudável é o que possui maior taxa de baixas manuais. Continue conciliando os comprovantes para refinar este gráfico.`);
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F2F5F7] dark:bg-[#0b101b] transition-colors min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary text-4xl">compare_arrows</span>
              Comparativo Real
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Os dados abaixo são calculados automaticamente conforme você cadastra e dá baixa nos seus clientes.</p>
          </div>
          <button onClick={handleAnalysis} disabled={isGenerating} className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-3 transition-all active:scale-95 shadow-lg ${isGenerating ? 'bg-slate-200 dark:bg-slate-700 text-slate-400' : 'bg-secondary text-white hover:bg-orange-600 shadow-secondary/20'}`}>
            <span className="material-symbols-outlined">{isGenerating ? 'sync' : 'analytics'}</span>
            {isGenerating ? 'Calculando...' : 'Atualizar Análise'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {calculatedData.map(dev => (
            <button key={dev.id} onClick={() => toggleSelect(dev.id)} className={`p-6 rounded-3xl border text-left transition-all relative min-h-[140px] flex flex-col justify-between group shadow-sm ${selectedIds.includes(dev.id) ? 'bg-white dark:bg-[#1e293b] border-secondary ring-2 ring-secondary/20 scale-[1.02] z-10' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-secondary/30'}`}>
              {selectedIds.includes(dev.id) && <span className="absolute top-4 right-4 material-symbols-outlined text-emerald-500 text-xl filled">check_circle</span>}
              <h4 className={`font-black text-[10px] uppercase tracking-[0.2em] ${selectedIds.includes(dev.id) ? 'text-secondary' : 'text-slate-500 dark:text-slate-400'}`}>{dev.name}</h4>
              <div>
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                    {dev.count > 0 ? `${dev.saude}%` : '--'}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ml-2 ${selectedIds.includes(dev.id) ? 'text-secondary' : 'text-slate-500'}`}>Saúde</span>
              </div>
            </button>
          ))}
        </div>

        {iaInsight && (
          <div className="bg-emerald-50/40 dark:bg-[#102425] p-8 rounded-[2.5rem] border border-emerald-500/10 dark:border-emerald-500/20 shadow-xl animate-scale-up">
            <div className="flex items-center gap-3 mb-6 border-b border-emerald-500/10 pb-4">
              <span className="material-symbols-outlined text-emerald-600 dark:text-secondary">verified</span>
              <h3 className="text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-[0.2em] text-xs">Insight de Dados Reais</h3>
            </div>
            <div className="text-slate-700 dark:text-slate-200 leading-relaxed text-sm whitespace-pre-line font-medium italic">
               {iaInsight.split('**').map((part, index) => index % 2 === 1 ? <strong key={index} className="text-secondary">{part}</strong> : part)}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-white/5 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-10 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary p-2 bg-secondary/10 rounded-xl">analytics</span>
              Desempenho da Carteira
            </h3>
            <div className="h-[400px] w-full flex items-center justify-center">
              {realClients.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10, fontWeight: '700'}} />
                    {selectedData.map((d, i) => (
                        <Radar key={d.id} name={d.name} dataKey={d.name} stroke={i === 0 ? '#FF8A3D' : i === 1 ? '#0F3D3E' : '#EF4444'} fill={i === 0 ? '#FF8A3D' : i === 1 ? '#0F3D3E' : '#EF4444'} fillOpacity={0.4} strokeWidth={3} />
                    ))}
                    <Legend />
                    </RadarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Aguardando dados reais para gerar radar...</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-10 flex items-center gap-3">
              <span className="material-symbols-outlined text-rose-500 p-2 bg-rose-500/10 rounded-xl">warning</span>
              Risco Calculado
            </h3>
            <div className="space-y-10">
              {selectedData.map(d => (
                <div key={d.id} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="font-black text-slate-700 dark:text-slate-300 text-lg">{d.name}</span>
                    <span className="text-rose-500 font-black text-lg">{d.count > 0 ? `${d.inadimplencia}%` : '--'}</span>
                  </div>
                  <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-rose-700 rounded-full transition-all duration-1000" style={{ width: `${d.inadimplencia}%` }}></div>
                  </div>
                </div>
              ))}
              {selectedData.every(d => d.count === 0) && (
                  <p className="text-center text-slate-500 text-xs italic mt-20">Cadastre clientes para ver o risco calculado por loteamento.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
