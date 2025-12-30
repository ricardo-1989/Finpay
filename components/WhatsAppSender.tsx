
import React, { useState, useEffect, useRef } from 'react';

interface WhatsAppSenderProps {
  clientId: number | null;
  onBack: () => void;
}

const templates = [
  {
    id: 'friendly',
    label: 'Lembrete Amigável',
    icon: 'sentiment_satisfied',
    color: 'bg-emerald-500',
    text: `Olá *{{nome}}*, tudo bem? 👋\n\nNotamos que a parcela do seu terreno ({{lote}}) referente a *{{referencia}}* no valor de *R$ {{valor}}* ainda consta em aberto.\n\nCaso já tenha pago, por favor desconsidere. Estou enviando o boleto em anexo para sua conferência.\n\nAtt, Equipe FinPay`
  },
  {
    id: 'warning',
    label: 'Aviso de Atraso',
    icon: 'warning',
    color: 'bg-orange-500',
    text: `Olá *{{nome}}*, como vai?\n\nIdentificamos um atraso de {{dias}} dias no pagamento da sua parcela ({{lote}}), valor *R$ {{valor}}*.\n\nPedimos a regularização imediata para evitar encargos adicionais e restrições. Segue o documento para pagamento em anexo.\n\nFicamos no aguardo.`
  },
  {
    id: 'legal',
    label: 'Notificação Jurídica',
    icon: 'gavel',
    color: 'bg-rose-500',
    text: `NOTIFICAÇÃO EXTRAJUDICIAL - FINPAY\n\nPrezado(a) *{{nome}}*,\n\nInformamos que seu contrato referente ao {{lote}} encontra-se em estágio crítico de inadimplência ({{dias}} dias).\n\nCaso o pagamento de *R$ {{valor}}* não seja identificado nas próximas 24h, o processo será encaminhado para negativação nos órgãos de proteção ao crédito. O boleto atualizado segue em anexo.\n\nAtt, Departamento Jurídico FinPay`
  }
];

const WhatsAppSender: React.FC<WhatsAppSenderProps> = ({ clientId, onBack }) => {
  const [client, setClient] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [delayDays, setDelayDays] = useState(15);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (clientId) {
      const saved = localStorage.getItem('finpay_clients');
      if (saved) {
        const allClients = JSON.parse(saved);
        const found = allClients.find((c: any) => c.id === clientId);
        if (found) {
          setClient(found);
          applyTemplateToClient(templates[0], found);
        }
      }
    }
  }, [clientId]);

  const applyTemplateToClient = (tpl: any, clientData: any) => {
    let t = tpl.text;
    t = t.replace('{{nome}}', clientData.name);
    t = t.replace('{{lote}}', clientData.lot);
    const cleanVal = clientData.val.replace('R$ ', '');
    t = t.replace('{{valor}}', cleanVal);
    t = t.replace('{{referencia}}', clientData.date);
    t = t.replace('{{dias}}', delayDays.toString());
    
    setMessage(t);
    setActiveTemplate(tpl.id);
  };

  const applyTemplate = (tpl: any) => {
    if (!client) return;
    applyTemplateToClient(tpl, client);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const openWhatsApp = () => {
    if (!client || !client.phone) {
        alert("Número de telefone não disponível para este cliente.");
        return;
    }
    const cleanPhone = client.phone.replace(/\D/g, '');
    const encodedMsg = encodeURIComponent(message);
    
    if (attachedFile) {
      alert(`O arquivo "${attachedFile.name}" foi selecionado. Como o WhatsApp Web não permite anexar arquivos via link direto, você deverá anexar o documento manualmente na conversa que será aberta.`);
    }
    
    window.open(`https://wa.me/55${cleanPhone}?text=${encodedMsg}`, '_blank');
  };

  const renderMessage = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*.*?\*|https?:\/\/[^\s]+|www\.[^\s]+|finpay\.com[^\s]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <strong key={i} className="text-secondary font-bold">{part.slice(1, -1)}</strong>;
      }
      if (part.match(/https?:\/\/[^\s]+|www\.[^\s]+|finpay\.com[^\s]+/)) {
          return <span key={i} className="text-[#38bdf8] underline cursor-pointer">{part}</span>;
      }
      return part;
    });
  };

  if (!client) {
    return (
      <div className="p-8 h-full flex items-center justify-center bg-background-light dark:bg-slate-900">
         <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-slate-400 animate-pulse">person_search</span>
            <h2 className="text-xl font-bold text-slate-600 dark:text-slate-300 mt-4">Nenhum cliente selecionado</h2>
            <button onClick={onBack} className="mt-4 text-secondary font-bold hover:underline">Voltar para a lista</button>
         </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-background-light dark:bg-slate-900 transition-colors">
       <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 cursor-pointer" onClick={onBack}>
          <span>Financeiro</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span>Cobrança</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-medium text-primary dark:text-white">WhatsApp</span>
       </nav>

       <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white tracking-tight leading-none mb-1">Enviar Mensagem WhatsApp</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Dados reais de cobrança vinculados ao contrato do cliente.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-24">
          <div className="lg:col-span-7 flex flex-col gap-6">
             {/* TEMPLATES */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {templates.map(tpl => (
                  <button 
                    key={tpl.id}
                    onClick={() => applyTemplate(tpl)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all group ${
                      activeTemplate === tpl.id 
                      ? 'bg-primary dark:bg-slate-700 border-primary dark:border-white shadow-lg scale-[1.02]' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${tpl.color} text-white shadow-sm`}>
                      <span className="material-symbols-outlined">{tpl.icon}</span>
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${activeTemplate === tpl.id ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {tpl.label}
                    </span>
                  </button>
                ))}
             </div>

             {/* CLIENT CARD */}
             <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-5">
                   <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="material-symbols-outlined text-lg">person</span> Destinatário Ativo
                   </div>
                   <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                      client.status === 'Atrasado' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 
                      client.status === 'Pago' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      'bg-orange-500/10 border-orange-500/20 text-orange-600'
                   }`}>
                      <div className={`size-2 rounded-full animate-pulse ${
                         client.status === 'Atrasado' ? 'bg-rose-500' : 
                         client.status === 'Pago' ? 'bg-emerald-500' :
                         'bg-orange-500'
                      }`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{client.status}</span>
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                   <div className="size-24 rounded-2xl bg-slate-100 dark:bg-slate-700 shrink-0 border-2 border-white dark:border-slate-600 shadow-lg flex items-center justify-center overflow-hidden">
                     {client.photo ? (
                        <img src={client.photo} alt={client.name} className="w-full h-full object-cover" />
                     ) : (
                        <span className="text-2xl font-black text-slate-400 dark:text-slate-500">{client.initials}</span>
                     )}
                   </div>
                   <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{client.name}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-3">
                         <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined text-base">call</span>
                            <span className="font-medium">{client.phone || 'Sem Telefone'}</span>
                         </div>
                         <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            <span className="font-medium">{client.lot}</span>
                         </div>
                         <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined text-base">payments</span>
                            <span className="font-black text-slate-700 dark:text-slate-200">{client.val}</span>
                         </div>
                         <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined text-base text-secondary">event</span>
                            <span className="font-bold text-slate-900 dark:text-white">Vencimento: {client.date}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* UPLOAD & CONTROLS */}
             <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 space-y-8">
                {/* ATRASO SLIDER */}
                <div>
                   <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Simular Atraso (Dias)</label>
                      <span className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg text-sm font-black text-secondary">{delayDays} dias</span>
                   </div>
                   <input 
                     type="range" min="1" max="90" value={delayDays} 
                     onChange={(e) => setDelayDays(parseInt(e.target.value))}
                     className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-secondary"
                   />
                </div>

                {/* FILE UPLOAD SECTION */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                   <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4">Anexar Documento (Boleto / PDF / Recibo)</label>
                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative group h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                        attachedFile 
                        ? 'bg-emerald-500/5 border-emerald-500/30' 
                        : 'bg-slate-50 dark:bg-black/10 border-slate-200 dark:border-slate-700 hover:border-secondary/50'
                      }`}
                   >
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,image/*,application/pdf" 
                        onChange={handleFileChange} 
                      />
                      {attachedFile ? (
                        <div className="flex items-center gap-3">
                           <div className="bg-emerald-500 text-white p-2 rounded-lg">
                              <span className="material-symbols-outlined text-[20px]">description</span>
                           </div>
                           <div className="text-left">
                              <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[200px]">{attachedFile.name}</p>
                              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Clique para alterar</p>
                           </div>
                           <button 
                             onClick={(e) => { e.stopPropagation(); setAttachedFile(null); }} 
                             className="ml-2 text-slate-400 hover:text-rose-500"
                           >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                           </button>
                        </div>
                      ) : (
                        <>
                           <span className="material-symbols-outlined text-slate-400 mb-1">upload_file</span>
                           <span className="text-xs font-bold text-slate-500">Arraste ou clique para selecionar o boleto</span>
                        </>
                      )}
                   </div>
                </div>
                
                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                   <button 
                      onClick={openWhatsApp}
                      className="w-full h-14 bg-whatsapp hover:bg-[#1da851] text-white rounded-2xl font-black shadow-xl shadow-whatsapp/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                   >
                       <span className="material-symbols-outlined">chat</span> Abrir WhatsApp Web
                   </button>
                </div>
             </div>
          </div>

          {/* PREVIEW PANEL */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
             <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full min-h-[600px]">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                   <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">smartphone</span> Pré-visualização Real
                   </h3>
                   <span className="text-[10px] font-black text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">WHATSAPP</span>
                </div>
                <div className="flex-1 bg-[#f0f2f5] dark:bg-slate-950 p-6 relative flex flex-col transition-colors duration-300">
                   <div className="flex justify-center mb-8">
                      <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-500 dark:text-slate-400 text-[10px] font-black px-4 py-1.5 rounded-xl shadow-sm uppercase tracking-widest">Hoje</span>
                   </div>
                   
                   <div className="self-start max-w-[90%] w-full bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-2xl rounded-tl-none p-5 shadow-xl border border-white/20 dark:border-slate-700/50 relative group transition-all">
                      <div className="absolute -left-2.5 top-0 w-0 h-0 border-t-[12px] border-t-white dark:border-t-slate-800/80 border-r-[12px] border-r-transparent"></div>
                      <div className="relative pr-8">
                          {isEditing ? (
                              <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full min-h-[350px] text-[15px] leading-relaxed text-[#111b21] dark:text-slate-200 resize-none outline-none bg-transparent font-sans"
                                autoFocus
                              />
                          ) : (
                              <p className="text-[15px] leading-relaxed text-[#111b21] dark:text-slate-200 whitespace-pre-wrap min-h-[100px]">
                                 {renderMessage(message)}
                              </p>
                          )}
                      </div>
                      <button 
                         onClick={() => setIsEditing(!isEditing)}
                         className={`absolute top-3 right-3 p-2 rounded-xl transition-all duration-200 ${isEditing ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-slate-200'}`}
                       >
                          <span className="material-symbols-outlined text-[18px]">{isEditing ? 'check' : 'edit'}</span>
                       </button>

                      {attachedFile && (
                         <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                            <span className="material-symbols-outlined text-secondary">picture_as_pdf</span>
                            <div className="flex-1 overflow-hidden">
                               <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{attachedFile.name}</p>
                               <p className="text-[10px] text-slate-400">PDF • Pronto para envio</p>
                            </div>
                         </div>
                      )}

                      <div className="flex justify-end items-end gap-1.5 mt-4 select-none opacity-60">
                         <span className="text-[11px] text-[#667781] dark:text-slate-400 font-bold">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                         <span className="material-symbols-outlined text-[18px] text-[#53bdeb] filled">done_all</span>
                      </div>
                   </div>

                   <div className="mt-auto pt-10 text-center">
                       <p className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest">
                           <span className="material-symbols-outlined text-[16px]">lock</span>
                           Criptografia de ponta a ponta
                       </p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

export default WhatsAppSender;
