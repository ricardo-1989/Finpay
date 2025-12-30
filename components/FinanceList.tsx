
import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GoogleGenAI } from "@google/genai";
import StatCard from './ui/StatCard';
import { formatNumber } from '../utils/formatters';

interface FinanceItem {
  id: number;
  initials: string;
  name: string;
  cpf: string;
  lot: string;
  parcel: string;
  date: string;
  val: string;
  numericVal: number;
  status: string;
  color: string;
  photo?: string | null;
  // Campos adicionais para evitar perda de dados na edição
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  developmentName?: string;
  originalDueDate?: string;
}

interface FinanceListProps {
  onOpenWhatsApp: (clientId: number) => void;
}

const FinanceList: React.FC<FinanceListProps> = ({ onOpenWhatsApp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<FinanceItem[]>([]);
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const [reconciliationModal, setReconciliationModal] = useState<{
    show: boolean;
    image?: string;
    extractedData?: { name: string; value: number; date: string };
    matchedClient?: FinanceItem;
  }>({ show: false });

  const [editModal, setEditModal] = useState<{
    show: boolean;
    client: FinanceItem | null;
  }>({ show: false, client: null });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editPhotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedData = localStorage.getItem('finpay_clients');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
        setData([]);
      }
    }
  };

  const saveData = (newData: FinanceItem[]) => {
    try {
      localStorage.setItem('finpay_clients', JSON.stringify(newData));
      setData(newData);
    } catch (e) {
      console.error("Erro ao salvar no localStorage:", e);
      alert("Erro ao salvar dados. Pode ser que o armazenamento esteja cheio (limite de fotos).");
    }
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cpf.includes(searchTerm)
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (data.length === 0) {
      alert("Por favor, cadastre seus clientes reais primeiro.");
      return;
    }

    setIsProcessingReceipt(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      const previewUrl = event.target?.result as string;

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            { inlineData: { mimeType: file.type, data: base64 } },
            { text: "Analise este comprovante e extraia JSON: { 'pagador': string, 'valor': number, 'data': string }. Valor sem R$." }
          ],
          config: { responseMimeType: "application/json" }
        });

        const extracted = JSON.parse(response.text || '{}');
        const match = data.find(c =>
          (extracted.pagador && c.name.toLowerCase().includes(extracted.pagador.toLowerCase().split(' ')[0])) ||
          (extracted.valor && Math.abs(c.numericVal - extracted.valor) < 1)
        );

        setReconciliationModal({
          show: true,
          image: previewUrl,
          extractedData: {
            name: extracted.pagador || 'Não identificado',
            value: extracted.valor || 0,
            date: extracted.data || '---'
          },
          matchedClient: match
        });
      } catch (error) {
        alert("Erro ao processar imagem.");
      } finally {
        setIsProcessingReceipt(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const confirmReconciliation = () => {
    if (reconciliationModal.matchedClient) {
      const updatedData = data.map(item =>
        item.id === reconciliationModal.matchedClient?.id
          ? { ...item, status: "Pago", color: "teal" }
          : item
      );
      saveData(updatedData);
      setReconciliationModal({ show: false });
    }
  };

  const generateReceipt = (item: any) => {
    const doc = new jsPDF();
    doc.setFillColor(15, 61, 62);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('RECIBO DE QUITAÇÃO', 105, 25, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
      startY: 85,
      body: [
        ['Beneficiário:', 'FinPay Gestão Imobiliária LTDA'],
        ['Pagador:', item.name],
        ['CPF:', item.cpf],
        ['Referência:', item.lot],
        ['Parcela:', item.parcel],
        ['Valor Pago:', item.val],
        ['Data do Recibo:', new Date().toLocaleDateString('pt-BR')],
      ],
      theme: 'plain',
    });
    doc.save(`recibo-${item.name.replace(/\s/g, '-')}.pdf`);
  };

  const openEditModal = (client: FinanceItem) => {
    setEditModal({ show: true, client: { ...client } });
  };

  const handleEditPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editModal.client) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditModal({
          ...editModal,
          client: { ...editModal.client!, photo: reader.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editModal.client) return;
    const value = e.target.value;
    const nums = value.replace(/\D/g, '');
    let formatted = "";
    if (nums) {
      formatted = (parseInt(nums) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
    setEditModal({
      ...editModal,
      client: { ...editModal.client, val: `R$ ${formatted}` }
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.client) return;

    let statusColor = 'orange';
    if (editModal.client.status === 'Pago') statusColor = 'teal';
    if (editModal.client.status === 'Atrasado') statusColor = 'red';

    const initials = editModal.client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const cleanVal = editModal.client.val.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    const numericVal = parseFloat(cleanVal) || 0;

    const updatedItem = {
      ...editModal.client,
      initials,
      numericVal,
      color: statusColor
    };

    const updatedData = data.map(item => item.id === updatedItem.id ? updatedItem : item);
    saveData(updatedData);
    setEditModal({ show: false, client: null });
  };

  const handleDeleteClient = () => {
    if (!editModal.client) return;
    if (confirm(`Deseja realmente excluir o lançamento de ${editModal.client.name}?`)) {
      const updatedData = data.filter(item => item.id !== editModal.client?.id);
      saveData(updatedData);
      setEditModal({ show: false, client: null });
    }
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-hidden bg-background-light dark:bg-slate-900 transition-colors">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">

          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Gestão de Parcelas</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Controle financeiro real dos seus clientes.</p>
              </div>
              <div className="flex gap-3">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingReceipt || data.length === 0}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95 ${isProcessingReceipt || data.length === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                    }`}
                >
                  <span className="material-symbols-outlined">{isProcessingReceipt ? 'sync' : 'document_scanner'}</span>
                  {isProcessingReceipt ? 'Analisando...' : 'Conciliar Comprovante'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Total Recebido"
                value={`R$ ${formatNumber(data.filter(i => i.status === 'Pago').reduce((acc, curr) => acc + curr.numericVal, 0))}`}
                pill="Atualizado"
                icon="payments"
                iconColor="text-emerald-500"
                iconBg="bg-emerald-500/10"
                trend="positive"
              />
              <StatCard
                title="Total em Atraso"
                value={`R$ ${formatNumber(data.filter(i => i.status === 'Atrasado').reduce((acc, curr) => acc + curr.numericVal, 0))}`}
                pill="Risco"
                icon="error"
                iconColor="text-rose-500"
                iconBg="bg-rose-500/10"
                trend="negative"
              />
              <StatCard
                title="A Vencer"
                value={`R$ ${formatNumber(data.filter(i => i.status === 'A Vencer').reduce((acc, curr) => acc + curr.numericVal, 0))}`}
                pill={`${data.filter(i => i.status === 'A Vencer').length} contratos`}
                icon="calendar_clock"
                iconColor="text-orange-500"
                iconBg="bg-orange-500/10"
                trend="neutral"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden transition-colors">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="w-full md:max-w-md relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                  placeholder="Filtrar clientes reais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Cliente</th>
                    <th className="px-8 py-5">Lote</th>
                    <th className="px-8 py-5">Vencimento</th>
                    <th className="px-8 py-5 text-right">Valor</th>
                    <th className="px-8 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredData.length > 0 ? filteredData.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                      <td className="px-8 py-6 flex items-center gap-3">
                        <button
                          onClick={() => openEditModal(item)}
                          className="relative group/avatar size-10 rounded-full flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white border-2 border-white dark:border-slate-600 shadow-sm transition-transform hover:scale-105"
                        >
                          {item.photo ? (
                            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-xs">{item.initials}</span>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="material-symbols-outlined text-white text-xs">edit</span>
                          </div>
                        </button>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white sensitive-data">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{item.parcel}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-600 dark:text-slate-300">{item.lot}</td>
                      <td className="px-8 py-6 text-sm text-slate-500 dark:text-white">{item.date}</td>
                      <td className="px-8 py-6 text-sm font-black text-right text-slate-900 dark:text-white sensitive-data">{item.val}</td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${item.color === 'red' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20' :
                          item.color === 'orange' ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20' :
                            'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20'
                          }`}>{item.status}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-secondary transition-colors" title="Editar Cliente">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => generateReceipt(item)} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Gerar Recibo">
                            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                          </button>
                          <button onClick={() => onOpenWhatsApp(item.id)} className="bg-whatsapp hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shadow-sm shadow-whatsapp/20">
                            <span className="material-symbols-outlined text-[16px]">chat</span>
                            WhatsApp
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-slate-400">
                        <div className="flex flex-col items-center">
                          <span className="material-symbols-outlined text-5xl mb-2 opacity-20">person_search</span>
                          <p className="font-bold">Nenhum cliente real encontrado.</p>
                          <p className="text-sm mt-1">Utilize a aba "Novo Cliente" para iniciar seus registros.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição de Cliente */}
      {editModal.show && editModal.client && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up border border-slate-200 dark:border-white/10 flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Editar Lançamento</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">ID: #{editModal.client.id.toString().slice(-6)}</p>
              </div>
              <button onClick={() => setEditModal({ show: false, client: null })} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-8 space-y-6 overflow-y-auto no-scrollbar max-h-[70vh]">
              <div className="flex flex-col items-center gap-3 mb-2">
                <div className="relative group">
                  <div className="size-28 rounded-full bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden flex items-center justify-center">
                    {editModal.client.photo ? (
                      <img src={editModal.client.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-slate-300 dark:text-slate-600">{editModal.client.initials}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => editPhotoInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-secondary text-white size-9 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-2 border-white dark:border-slate-900"
                  >
                    <span className="material-symbols-outlined text-lg">photo_camera</span>
                  </button>
                </div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest cursor-pointer hover:text-secondary transition-colors" onClick={() => editPhotoInputRef.current?.click()}>Alterar Foto do Perfil</label>
                <input ref={editPhotoInputRef} type="file" className="hidden" accept="image/*" onChange={handleEditPhotoChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Nome do Cliente</label>
                  <input
                    required
                    type="text"
                    value={editModal.client.name}
                    onChange={(e) => setEditModal({ ...editModal, client: { ...editModal.client!, name: e.target.value } })}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">CPF / CNPJ</label>
                  <input
                    type="text"
                    value={editModal.client.cpf}
                    onChange={(e) => setEditModal({ ...editModal, client: { ...editModal.client!, cpf: e.target.value } })}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Referência / Lote</label>
                  <input
                    type="text"
                    value={editModal.client.lot}
                    onChange={(e) => setEditModal({ ...editModal, client: { ...editModal.client!, lot: e.target.value } })}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Valor (R$)</label>
                  <input
                    required
                    type="text"
                    value={editModal.client.val}
                    onChange={handleEditValueChange}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-3.5 text-sm font-black text-slate-900 dark:text-white outline-none focus:border-secondary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Data Vencimento</label>
                  <input
                    required
                    type="text"
                    value={editModal.client.date}
                    onChange={(e) => setEditModal({ ...editModal, client: { ...editModal.client!, date: e.target.value } })}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Status do Pagamento</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Pago', 'A Vencer', 'Atrasado'].map(st => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setEditModal({ ...editModal, client: { ...editModal.client!, status: st } })}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${editModal.client!.status === st
                          ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-500 hover:border-secondary/50'
                          }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-3">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setEditModal({ show: false, client: null })}
                    className="flex-1 py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                  >
                    Descartar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-primary dark:bg-slate-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                  >
                    Salvar Alterações
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteClient}
                  className="w-full py-3 text-rose-500 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">delete</span> Excluir Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reconciliationModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up flex flex-col md:flex-row border border-white/10">
            <div className="w-full md:w-1/2 bg-slate-900 flex items-center justify-center p-4">
              <img src={reconciliationModal.image} alt="Comprovante" className="max-h-[400px] object-contain rounded-lg shadow-xl" />
            </div>
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-500 mb-6">
                  <span className="material-symbols-outlined font-black">verified</span>
                  <h3 className="font-black uppercase tracking-[0.2em] text-[10px]">Conciliação FinPay Vision</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Detectado na Imagem</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white uppercase leading-tight">{reconciliationModal.extractedData?.name}</p>
                    <p className="text-2xl font-black text-emerald-500">R$ {reconciliationModal.extractedData?.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>

                  {reconciliationModal.matchedClient ? (
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-500/20">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check_circle</span> Correspondência Local Encontrada
                      </p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{reconciliationModal.matchedClient.name}</p>
                      <p className="text-xs text-slate-500">{reconciliationModal.matchedClient.lot}</p>
                    </div>
                  ) : (
                    <div className="bg-rose-50 dark:bg-rose-900/10 p-5 rounded-2xl border border-rose-500/20">
                      <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Divergência</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Nenhum cliente real com este nome ou valor exato foi encontrado no seu banco de dados.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3">
                <button
                  onClick={confirmReconciliation}
                  disabled={!reconciliationModal.matchedClient}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-30"
                >
                  Dar Baixa Agora
                </button>
                <button onClick={() => setReconciliationModal({ show: false })} className="w-full py-3 text-slate-500 font-bold text-sm">Descartar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceList;
