import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const data = [
  { name: 'Jan', current: 100, prev: 120 },
  { name: 'Fev', current: 130, prev: 115 },
  { name: 'Mar', current: 150, prev: 130 },
  { name: 'Abr', current: 180, prev: 110 },
  { name: 'Mai', current: 200, prev: 100 },
  { name: 'Jun', current: 230, prev: 90 },
];

const FinancialReports: React.FC = () => {
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header Background
    doc.setFillColor(15, 61, 62); // Primary color
    doc.rect(0, 0, 210, 20, 'F');
    
    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('FinPay - Relatório Financeiro', 14, 13);

    // Document Title & Metadata
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text('Resumo Executivo', 14, 40);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, 48);
    doc.text('Período: Último Semestre', 14, 53);

    // Summary Statistics Section
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 60, 196, 60);

    doc.setFontSize(12);
    doc.setTextColor(15, 61, 62);
    doc.text('Total Acumulado', 14, 70);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('R$ 1.200.000,00', 14, 78);

    doc.setFontSize(12);
    doc.setTextColor(15, 61, 62);
    doc.text('Taxa de Inadimplência', 110, 70);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('4.2% (Estável)', 110, 78);

    doc.line(14, 85, 196, 85);

    // Data Table Section
    doc.setFontSize(14);
    doc.setTextColor(15, 61, 62);
    doc.text('Detalhamento de Lançamentos Recentes', 14, 100);

    const tableColumn = ["ID", "Cliente", "Vencimento", "Valor", "Status"];
    const tableRows = [
      ["#4832", "Carlos Andrade", "15 Out 2023", "R$ 1.250,00", "Pago"],
      ["#4833", "Fernanda Silva", "10 Out 2023", "R$ 980,00", "Atrasado"],
      ["#4834", "Roberto Oliveira", "25 Out 2023", "R$ 980,00", "Pendente"],
      ["#4835", "Mariana Lagos", "28 Out 2023", "R$ 1.450,00", "Pendente"],
    ];

    autoTable(doc, {
      startY: 105,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 61, 62], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('© 2023 FinPay. Todos os direitos reservados.', 14, pageHeight - 10);

    doc.save('finpay-relatorio.pdf');
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-background-light dark:bg-slate-900 transition-colors">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight mb-2">Relatórios Financeiros</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal max-w-2xl">
              Visão geral do desempenho dos loteamentos, eficiência de cobrança e controle de inadimplência.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              Exportar PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm text-sm font-medium">
              <span className="material-symbols-outlined text-lg">share</span>
              Compartilhar
            </button>
          </div>
        </header>

        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 transition-colors">
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col min-w-40 flex-1">
              <span className="text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Período</span>
              <input 
                className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-11 text-sm p-2 border transition-colors" 
                type="date" 
                defaultValue="2023-10-01"
              />
            </label>
            <span className="text-gray-400 self-center hidden md:block">até</span>
            <label className="flex flex-col min-w-40 flex-1">
              <span className="text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Fim</span>
              <input 
                className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-11 text-sm p-2 border transition-colors" 
                type="date" 
                defaultValue="2023-10-31"
              />
            </label>
            <button className="h-11 px-6 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm flex items-center justify-center gap-2 min-w-[120px]">
              <span className="material-symbols-outlined text-lg">filter_alt</span>
              Filtrar
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Chart 1 */}
           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col gap-6 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-slate-900 dark:text-white text-lg font-bold">Evolução da Inadimplência</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">% de contratos atrasados</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F3D3E" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0F3D3E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                    <Area type="monotone" dataKey="current" stroke="#0F3D3E" fillOpacity={1} fill="url(#colorCurrent)" strokeWidth={2} />
                    <Area type="monotone" dataKey="prev" stroke="#cbd5e1" fill="transparent" strokeDasharray="5 5" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
           
           {/* Chart 2 - Placeholder for layout symmetry */}
           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col gap-6 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-slate-900 dark:text-white text-lg font-bold">Receita por Mês</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Comparativo semestral</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 dark:text-white text-xl font-bold">R$ 1.2M</p>
                  <p className="text-green-600 dark:text-green-400 text-xs font-medium">Total Acumulado</p>
                </div>
              </div>
               {/* Simplified visual representation */}
               <div className="h-64 flex items-end justify-between px-4 gap-2">
                  {[40, 35, 55, 70, 60, 65].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 dark:bg-primary/40 rounded-t-sm hover:bg-primary/40 dark:hover:bg-primary/60 transition-all relative group" style={{height: `${h}%`}}>
                       {h === 70 && <div className="absolute top-0 w-full bg-primary h-full opacity-50"></div>}
                    </div>
                  ))}
               </div>
               <div className="flex justify-between px-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
               </div>
           </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
           <div className="p-6 border-b border-gray-200 dark:border-slate-700">
             <h3 className="text-slate-900 dark:text-white text-lg font-bold">Detalhamento de Lançamentos</h3>
           </div>
           <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                 <tr>
                    <th className="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">ID</th>
                    <th className="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Cliente</th>
                    <th className="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Vencimento</th>
                    <th className="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 text-right">Valor</th>
                    <th className="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 text-center">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                   <td className="py-4 px-6 text-sm text-primary dark:text-secondary font-medium">#4832</td>
                   <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">Carlos Andrade</td>
                   <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">15 Out 2023</td>
                   <td className="py-4 px-6 text-sm font-bold text-right text-primary dark:text-white">R$ 1.250,00</td>
                   <td className="py-4 px-6 text-center"><span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full font-medium">Pago</span></td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                   <td className="py-4 px-6 text-sm text-primary dark:text-secondary font-medium">#4833</td>
                   <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">Fernanda Silva</td>
                   <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">10 Out 2023</td>
                   <td className="py-4 px-6 text-sm font-bold text-right text-primary dark:text-white">R$ 980,00</td>
                   <td className="py-4 px-6 text-center"><span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-1 rounded-full font-medium">Atrasado</span></td>
                </tr>
              </tbody>
           </table>
        </section>
      </div>
    </div>
  );
}

export default FinancialReports;