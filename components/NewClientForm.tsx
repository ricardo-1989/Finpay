
import React, { useState, useRef } from 'react';
import useClients from '../hooks/useClients'; // Import the new hook

const NewClientForm: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
   const { addClient } = useClients(); // Destructure addClient
   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const [formData, setFormData] = useState({
      name: '',
      cpf: '',
      phone: '',
      email: '',
      address: '',
      development: '',
      block: '',
      lot: '',
      status: 'A Vencer',
      installmentCount: '120',
      installmentValue: '',
      dueDate: '',
      notes: ''
   });

   const developmentsList = [
      'CHÁCARAS GIRASSOL',
      'CHÁCARAS INHUMAS',
      'CHÁCARAS NOVA OLINDA',
      'CHÁCARAS ALDEIAS',
      'CHÁCARAS DONA OLGA',
      'CHÁCARAS JABUTI',
      'CHÁCARAS VITÓRIA',
      'CHÁCARAS BOM JARDIM'
   ];

   const blockOptions = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => setPreviewUrl(reader.result as string);
         reader.readAsDataURL(file);
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      let newValue = value;

      if (name === 'cpf') {
         newValue = value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2');
      } else if (name === 'phone') {
         const nums = value.replace(/\D/g, '').slice(0, 11);
         if (!nums) newValue = '';
         else if (nums.length <= 2) newValue = `(${nums}`;
         else if (nums.length <= 6) newValue = `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
         else if (nums.length <= 10) newValue = `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
         else newValue = `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
      } else if (name === 'installmentValue') {
         const nums = value.replace(/\D/g, '');
         if (!nums) newValue = '';
         else newValue = (parseInt(nums) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      }

      setFormData(prev => ({ ...prev, [name]: newValue }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.installmentValue || !formData.dueDate) {
         alert("Por favor, preencha os campos obrigatórios: Nome, Valor e Vencimento.");
         return;
      }

      try {
         const initials = formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
         const numericVal = parseFloat(formData.installmentValue.replace(/\./g, '').replace(',', '.'));
         const formattedDate = new Date(formData.dueDate + 'T12:00:00').toLocaleDateString('pt-BR');

         // Using the new Supabase-connected hook
         await addClient({
            initials,
            name: formData.name,
            cpf: formData.cpf,
            lot: `${formData.development} - Qd ${formData.block} Lt ${formData.lot}`,
            developmentName: formData.development,
            parcel: `Parc. 01/${formData.installmentCount}`,
            date: formattedDate,
            val: `R$ ${formData.installmentValue}`,
            numericVal,
            status: 'A Vencer',
            color: 'orange',
            photo: previewUrl,
            notes: formData.notes,
            address: formData.address,
            originalDueDate: formData.dueDate,
            email: formData.email,
            phone: formData.phone
         });

         alert('Cliente cadastrado com sucesso!');
         onCancel();
      } catch (err) {
         console.error(err);
         alert('Erro ao salvar cliente. Tente novamente.');
      }
   };

   return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F2F5F7] dark:bg-slate-950 transition-colors min-h-screen">
         <div className="max-w-[1200px] mx-auto space-y-8 pb-24">

            <header className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-6">
               <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 p-3 rounded-2xl">
                     <span className="material-symbols-outlined text-secondary text-3xl filled">person_add</span>
                  </div>
                  <div>
                     <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Identificação do Comprador</h2>
                     <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5">Gestão de contrato e fluxo financeiro em tempo real.</p>
                  </div>
               </div>
               <button onClick={onCancel} className="text-slate-400 hover:text-secondary transition-colors">
                  <span className="material-symbols-outlined text-3xl">close</span>
               </button>
            </header>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-white/5 overflow-hidden">

               {/* SEÇÃO 1: DADOS PESSOAIS */}
               <div className="p-8 md:p-10 space-y-10">
                  <div className="flex flex-col xl:flex-row gap-12 items-start">
                     {/* Avatar Section */}
                     <div className="xl:col-span-2 flex flex-col items-center gap-4 shrink-0">
                        <div className="relative group">
                           <div className="size-36 rounded-full bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden flex items-center justify-center transition-all group-hover:border-secondary/50">
                              {previewUrl ? (
                                 <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                 <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">account_circle</span>
                              )}
                           </div>
                           <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-secondary text-white size-10 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-2 border-white dark:border-slate-900">
                              <span className="material-symbols-outlined text-xl">photo_camera</span>
                           </button>
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em]">Foto do Perfil</span>
                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                     </div>

                     {/* Personal Inputs */}
                     <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-8">
                        <div className="md:col-span-12 lg:col-span-6">
                           <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Nome Completo</label>
                           <input name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all" placeholder="Nome do titular do contrato" type="text" />
                        </div>
                        <div className="md:col-span-6 lg:col-span-3">
                           <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">CPF / CNPJ</label>
                           <input name="cpf" value={formData.cpf} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all" placeholder="000.000.000-00" type="text" />
                        </div>
                        <div className="md:col-span-6 lg:col-span-3">
                           <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">WhatsApp</label>
                           <input name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all" placeholder="(00) 0 0000-0000" type="tel" />
                        </div>
                        <div className="md:col-span-12 lg:col-span-5">
                           <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Email de Contato</label>
                           <input name="email" value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all" placeholder="contato@cliente.com" type="email" />
                        </div>
                        <div className="md:col-span-12 lg:col-span-7">
                           <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Endereço de Correspondência</label>
                           <input name="address" value={formData.address} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all" placeholder="Rua, Número, Bairro, Cidade" type="text" />
                        </div>
                     </div>
                  </div>
               </div>

               {/* SEÇÃO 2: LOCALIZAÇÃO E FLUXO FINANCEIRO */}
               <div className="p-8 md:p-10 bg-slate-50 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 space-y-10">
                  <div className="flex items-center gap-4">
                     <div className="bg-secondary/10 p-2.5 rounded-xl">
                        <span className="material-symbols-outlined text-secondary filled">map</span>
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Localização e Fluxo Financeiro</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-8">
                     <div className="md:col-span-6 lg:col-span-6">
                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Empreendimento Selecionado</label>
                        <select name="development" value={formData.development} onChange={handleChange} required className="w-full h-[54px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary appearance-none transition-all">
                           <option value="">Selecione um loteamento...</option>
                           {developmentsList.map((dev, index) => <option key={index} value={dev}>{dev}</option>)}
                        </select>
                     </div>
                     <div className="md:col-span-3 lg:col-span-3">
                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Quadra</label>
                        <select name="block" value={formData.block} onChange={handleChange} className="w-full h-[54px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all">
                           <option value="">---</option>
                           {blockOptions.map(letter => <option key={letter} value={letter}>{letter}</option>)}
                        </select>
                     </div>
                     <div className="md:col-span-3 lg:col-span-3">
                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Número do Lote</label>
                        <input name="lot" value={formData.lot} onChange={handleChange} className="w-full h-[54px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all" placeholder="Ex: 05" type="text" />
                     </div>

                     {/* Linha de Baixo Encaixada */}
                     <div className="md:col-span-4 lg:col-span-4">
                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Total de Parcelas</label>
                        <input name="installmentCount" value={formData.installmentCount} onChange={handleChange} className="w-full h-[54px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all" placeholder="120" type="number" />
                     </div>
                     <div className="md:col-span-4 lg:col-span-4">
                        <label className="block text-[11px] font-black text-secondary uppercase tracking-widest mb-3">Vencimento (1ª Parcela)</label>
                        <input name="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full h-[54px] rounded-xl border border-secondary/30 dark:border-secondary/20 bg-white dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all font-black" type="date" />
                     </div>
                     <div className="md:col-span-4 lg:col-span-4">
                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Valor da Parcela</label>
                        <div className="relative h-[54px]">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">R$</span>
                           <input name="installmentValue" value={formData.installmentValue} onChange={handleChange} required className="w-full h-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 pl-11 pr-4 py-4 text-sm font-black text-slate-900 dark:text-white outline-none focus:border-secondary transition-all" placeholder="0,00" type="text" />
                        </div>
                     </div>

                     <div className="md:col-span-12">
                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Observações Adicionais</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-5 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all resize-none" placeholder="Informações relevantes sobre o contrato, descontos ou histórico..."></textarea>
                     </div>
                  </div>
               </div>

               {/* ACTIONS */}
               <div className="p-8 bg-slate-100 dark:bg-black/40 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                     <span className="material-symbols-outlined text-emerald-500 text-3xl">cloud_done</span>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Backup na Nuvem</p>
                        <p className="text-[11px] font-medium opacity-60">Seus dados são criptografados e salvos no Supabase.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto">
                     <button type="button" onClick={onCancel} className="flex-1 md:flex-none px-8 py-4 text-sm font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Cancelar</button>
                     <button type="submit" className="flex-1 md:flex-none px-14 py-4 bg-secondary hover:bg-orange-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-secondary/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-xl">check_circle</span> Finalizar Cadastro
                     </button>
                  </div>
               </div>

            </form>
         </div>
      </div>
   );
}

export default NewClientForm;