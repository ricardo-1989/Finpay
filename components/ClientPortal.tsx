import React from 'react';
import Logo from './Logo';

const ClientPortal: React.FC<{onLogout: () => void}> = ({onLogout}) => {
  return (
    <div className="bg-background-light min-h-screen flex flex-col">
       <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex justify-between h-16">
                <div className="flex items-center gap-8">
                   <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-1.5 rounded-lg">
                        <Logo className="w-8 h-8" classNamePath="fill-[#2b8cee]" />
                      </div>
                      <span className="text-xl font-black tracking-tight text-slate-900">Portal do Cliente</span>
                   </div>
                   <nav className="hidden md:flex gap-6">
                      <a className="text-sm font-medium text-[#2b8cee] border-b-2 border-[#2b8cee] py-5 px-1" href="#">Meus Pagamentos</a>
                      <a className="text-sm font-medium text-slate-600 hover:text-[#2b8cee] py-5 px-1 transition-colors" href="#">Boletos</a>
                   </nav>
                </div>
                <div className="flex items-center gap-4">
                   <button onClick={onLogout} className="flex items-center justify-center h-9 px-4 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-[20px] mr-2">logout</span> Sair
                   </button>
                   <div className="h-9 w-9 rounded-full bg-cover bg-center border border-slate-200" style={{backgroundImage: "url('https://i.pravatar.cc/150?img=11')"}}></div>
                </div>
             </div>
          </div>
       </header>

       <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
             <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Olá, Carlos Mendes</h1>
             <p className="text-slate-500 text-lg">Bem-vindo ao seu painel. Confira abaixo as informações do seu lote e faturas.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Hero Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                      <span className="material-symbols-outlined text-9xl">receipt_long</span>
                   </div>
                   <div className="relative z-10">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                               <p className="text-sm font-bold text-orange-600 uppercase tracking-wider">Próximo Vencimento</p>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">15 Out 2023</h2>
                         </div>
                         <div className="text-right">
                            <p className="text-sm text-slate-500 font-medium mb-1">Valor da Parcela</p>
                            <p className="text-2xl font-bold text-slate-900">R$ 1.250,00</p>
                         </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                         <button className="flex-1 bg-[#2b8cee] hover:bg-blue-600 text-white h-12 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20">
                            <span className="material-symbols-outlined">barcode</span> Segunda Via do Boleto
                         </button>
                         <button className="flex-1 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                            <span className="material-symbols-outlined">content_copy</span> Copiar Código de Barras
                         </button>
                      </div>
                   </div>
                </div>

                {/* History */}
                <div>
                   <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Histórico de Pagamentos</h3>
                   <div className="flex flex-col gap-3">
                      <HistoryItem 
                        label="Parcela 12/60 - Setembro" 
                        date="Vencimento: 15 Set 2023" 
                        val="R$ 1.250,00" 
                        status="late" 
                      />
                      <HistoryItem 
                        label="Parcela 11/60 - Agosto" 
                        date="Pago em: 14 Ago 2023" 
                        val="R$ 1.250,00" 
                        status="paid" 
                      />
                      <HistoryItem 
                        label="Parcela 10/60 - Julho" 
                        date="Pago em: 15 Jul 2023" 
                        val="R$ 1.250,00" 
                        status="paid" 
                      />
                   </div>
                </div>
             </div>
             
             <div className="flex flex-col gap-6">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-fit">
                   <div className="h-48 bg-slate-800 bg-cover bg-center relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=2068&auto=format&fit=crop')"}}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                         <p className="font-bold text-lg leading-tight">Loteamento Vale Verde</p>
                         <p className="text-sm opacity-90">São José dos Campos - SP</p>
                      </div>
                   </div>
                   <div className="p-6">
                      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                         <div><p className="text-xs text-slate-500 uppercase font-bold">Quadra</p><p className="text-lg font-bold">Q-04</p></div>
                         <div className="text-right"><p className="text-xs text-slate-500 uppercase font-bold">Lote</p><p className="text-lg font-bold">12</p></div>
                         <div className="text-right"><p className="text-xs text-slate-500 uppercase font-bold">Área</p><p className="text-lg font-bold">450m²</p></div>
                      </div>
                      <button className="w-full text-[#2b8cee] font-bold text-sm flex items-center justify-center gap-1">Ver Contrato Completo <span className="material-symbols-outlined">arrow_forward</span></button>
                   </div>
                </div>
             </div>
          </div>
       </main>
    </div>
  );
}

interface HistoryItemProps {
   label: string;
   date: string;
   val: string;
   status: 'paid' | 'late' | 'pending';
}

const HistoryItem = ({ label, date, val, status }: HistoryItemProps) => {
   const getStatusStyles = (status: string) => {
      switch (status) {
         case 'paid':
            return {
               iconBg: 'bg-green-100',
               iconColor: 'text-green-600',
               icon: 'check',
               badgeBg: 'bg-green-50',
               badgeColor: 'text-green-700',
               badgeBorder: 'border-green-100',
               text: 'Pago'
            };
         case 'late':
            return {
               iconBg: 'bg-red-100',
               iconColor: 'text-red-600',
               icon: 'priority_high',
               badgeBg: 'bg-red-50',
               badgeColor: 'text-red-700',
               badgeBorder: 'border-red-100',
               text: 'Atrasado'
            };
         case 'pending':
            return {
               iconBg: 'bg-orange-100',
               iconColor: 'text-orange-600',
               icon: 'hourglass_empty',
               badgeBg: 'bg-orange-50',
               badgeColor: 'text-orange-700',
               badgeBorder: 'border-orange-100',
               text: 'Pendente'
            };
         default:
            return {
               iconBg: 'bg-gray-100',
               iconColor: 'text-gray-600',
               icon: 'question_mark',
               badgeBg: 'bg-gray-50',
               badgeColor: 'text-gray-700',
               badgeBorder: 'border-gray-100',
               text: 'Desconhecido'
            };
      }
   };

   const styles = getStatusStyles(status);

   return (
      <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-4 shadow-sm transition-all hover:shadow-md">
         <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full ${styles.iconBg} ${styles.iconColor} flex items-center justify-center shrink-0`}>
               <span className="material-symbols-outlined">{styles.icon}</span>
            </div>
            <div>
               <p className="font-bold text-slate-900">{label}</p>
               <p className="text-xs text-slate-500">{date}</p>
            </div>
         </div>
         <div className="text-right flex items-center gap-4 ml-auto sm:ml-0">
            <div className="flex flex-col items-end">
               <p className="font-bold text-slate-900">{val}</p>
               <span className={`px-2.5 py-0.5 rounded-full ${styles.badgeBg} ${styles.badgeColor} text-[10px] uppercase font-bold border ${styles.badgeBorder} tracking-wide`}>
                  {styles.text}
               </span>
            </div>
            <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-slate-50">
               <span className="material-symbols-outlined">download</span>
            </button>
         </div>
      </div>
   );
};

export default ClientPortal;