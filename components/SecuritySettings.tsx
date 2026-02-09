
import React, { useState } from 'react';

import useClients from '../hooks/useClients'; // Import hook

const SecuritySettings: React.FC = () => {
   const [isExporting, setIsExporting] = useState(false);
   const [isImporting, setIsImporting] = useState(false);
   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
   const { addClient } = useClients(); // Get addClient

   const exportBackup = () => {
      setIsExporting(true);
      try {
         // Get clients from LocalStorage for legacy backup OR from current state if needed
         // For now, prioritize LocalStorage "finpay_clients" as that's what we are trying to rescue
         const localClients = localStorage.getItem('finpay_clients');

         const backupData = {
            theme: localStorage.getItem('theme'),
            followups: localStorage.getItem('finpay_followups'),
            clients: localClients ? JSON.parse(localClients) : [], // Export clients too!
            exportDate: new Date().toISOString(),
            version: "1.1.0"
         };

         const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = `finpay-backup-FULL-${new Date().toISOString().split('T')[0]}.json`;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);

         setMessage({ type: 'success', text: 'Backup COMPLETO (com clientes) exportado!' });
      } catch (err) {
         setMessage({ type: 'error', text: 'Erro ao gerar backup.' });
      } finally {
         setIsExporting(false);
         setTimeout(() => setMessage(null), 3000);
      }
   };

   const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsImporting(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
         try {
            const content = e.target?.result as string;
            const data = JSON.parse(content);

            // Restore settings
            if (data.theme) localStorage.setItem('theme', data.theme);
            if (data.followups) localStorage.setItem('finpay_followups', data.followups);

            // Restore Clients to Supabase
            let clientsToRestore = [];

            if (Array.isArray(data)) {
               clientsToRestore = data;
            } else {
               clientsToRestore = data.clients || data.finpay_clients; // Support both names
            }

            let restoredCount = 0;
            if (Array.isArray(clientsToRestore) && clientsToRestore.length > 0) {
               for (const client of clientsToRestore) {
                  try {
                     // Normalize data structure slightly before adding
                     await addClient({
                        name: client.name || 'Sem Nome',
                        cpf: client.cpf || '',
                        lot: client.lot || '',
                        parcel: client.parcel || '',
                        date: client.date || new Date().toISOString().split('T')[0], // Fallback date
                        val: client.val || 'R$ 0,00',
                        numericVal: client.numericVal || 0,
                        status: client.status || 'A Vencer',
                        color: client.color || 'orange',
                        initials: client.initials || '??',
                        // ... other fields optional
                        phone: client.phone,
                        email: client.email,
                        address: client.address,
                        notes: client.notes,
                        photo: client.photo
                     });
                     restoredCount++;
                  } catch (err) {
                     console.error("Failed to restore client", client, err);
                  }
               }
            }

            setMessage({ type: 'success', text: `Sucesso! Settings + ${restoredCount} clientes recuperados.` });
            setTimeout(() => window.location.reload(), 2000);
         } catch (err) {
            setMessage({ type: 'error', text: 'Erro ao importar. Arquivo inválido?' });
            console.error(err);
         } finally {
            setIsImporting(false);
         }
      };

      reader.readAsText(file);
   };

   return (
      <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-background-light dark:bg-slate-900 transition-colors">
         <div className="max-w-4xl mx-auto flex flex-col gap-10">

            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 dark:bg-white/10 rounded-2xl">
                     <span className="material-symbols-outlined text-primary dark:text-white text-3xl">security</span>
                  </div>
                  <div>
                     <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Central de Segurança</h1>
                     <p className="text-slate-500 dark:text-slate-400">Proteja seus dados locais e migre suas informações de forma segura.</p>
                  </div>
               </div>
            </div>

            {message && (
               <div className={`p-4 rounded-xl border animate-fade-in flex items-center gap-3 ${message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                  }`}>
                  <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                  <span className="font-bold text-sm">{message.text}</span>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

               {/* Export Card */}
               <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-6">
                  <div className="size-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                     <span className="material-symbols-outlined text-2xl">download</span>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Exportar Backup</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Baixe todas as suas notas de follow-up, status de clientes e preferências em um único arquivo JSON. Guarde-o em local seguro.
                     </p>
                  </div>
                  <button
                     onClick={exportBackup}
                     disabled={isExporting}
                     className="mt-auto w-full py-4 bg-whatsapp text-white rounded-2xl font-black text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-whatsapp/20"
                  >
                     {isExporting ? (
                        <span className="material-symbols-outlined animate-spin">sync</span>
                     ) : (
                        <>
                           <span className="material-symbols-outlined">save</span>
                           Gerar Arquivo de Backup
                        </>
                     )}
                  </button>
               </div>

               {/* Import Card */}
               <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-6">
                  <div className="size-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                     <span className="material-symbols-outlined text-2xl">upload_file</span>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Restaurar Dados</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Se você trocou de computador ou deseja recuperar informações antigas, faça o upload do seu arquivo de backup aqui.
                     </p>
                  </div>
                  <div className="mt-auto relative">
                     <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        disabled={isImporting}
                     />
                     <button
                        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2"
                     >
                        <span className="material-symbols-outlined">cloud_upload</span>
                        {isImporting ? 'Restaurando...' : 'Selecionar Arquivo .json'}
                     </button>
                  </div>
               </div>

            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6">
               <span className="material-symbols-outlined text-4xl text-slate-400">info</span>
               <div className="text-center md:text-left">
                  <h4 className="font-bold text-slate-900 dark:text-white">Seus dados estão seguros e privados.</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                     O FinPay armazena informações críticas localmente no seu navegador. O backup garante que você nunca perca o histórico de negociações, mesmo limpando o cache.
                  </p>
               </div>
            </div>

         </div>
      </div>
   );
};

export default SecuritySettings;
