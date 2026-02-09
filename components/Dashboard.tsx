import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ViewState } from '../types';
import StatCard from './ui/StatCard';
import { formatNumber, getCurrentDateString } from '../utils/formatters';
import useClients from '../hooks/useClients';

interface DashboardProps {
  onViewChange: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const [currentDateStr, setCurrentDateStr] = useState('');
  const { clients, totalReceived, totalPending, totalLate, migrateLocalStorage } = useClients();

  // Meta padrão baseada nos dados ou meta fixa do usuário
  const goal = 100000;
  const percentage = goal > 0 ? Math.min((totalReceived / goal) * 100, 100) : 0;

  useEffect(() => {
    const updateTime = () => {
      setCurrentDateStr(getCurrentDateString());
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const pieData = [
    { name: 'Pago', value: clients.filter(c => c.status === 'Pago').length || 0, color: '#0F3D3E' },
    { name: 'Pendente', value: clients.filter(c => c.status === 'A Vencer').length || 0, color: '#FF8A3D' },
    { name: 'Atrasado', value: clients.filter(c => c.status === 'Atrasado').length || 0, color: '#EF4444' },
  ];

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 transition-colors">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Painel Real</h2>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>
          <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 hidden md:flex">
            <span className="material-symbols-outlined text-base">calendar_today</span>
            <span>{currentDateStr}</span>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-all">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">Admin Master</span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
            </span>
          </div>
          <div className="relative">
            <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden ring-2 ring-primary/5 transition-all group-hover:ring-primary/20">
              <img src="/admin-avatar.png" alt="Admin Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F2F5F7] dark:bg-slate-900 transition-colors">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Meta Mensal (Dinheiro Real)</h4>
                <p className="text-slate-900 dark:text-white font-bold sensitive-data">R$ {formatNumber(totalReceived)} de R$ {formatNumber(goal)}</p>
              </div>
              <span className="text-2xl font-black text-secondary">{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-4 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Receita Real"
              value={`R$ ${formatNumber(totalReceived)}`}
              pill="Dados atuais"
              icon="payments"
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-500"
              trend="positive"
            />
            <StatCard
              title="Total Pendente"
              value={`R$ ${formatNumber(totalPending)}`}
              pill="A vencer"
              icon="account_balance_wallet"
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
              trend="positive"
            />
            <StatCard
              title="Inadimplência"
              value={`R$ ${formatNumber(totalLate)}`}
              pill="Crítico"
              icon="error"
              iconBg="bg-rose-500/10"
              iconColor="text-rose-500"
              trend="negative"
            />
            <StatCard
              title="Base de Clientes"
              value={clients.length.toString()}
              pill="Cadastros reais"
              icon="group"
              iconBg="bg-orange-500/10"
              iconColor="text-orange-500"
              trend="positive"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center min-h-[300px]">
              <div className="text-center text-slate-400">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">insights</span>
                <p className="font-bold">Aguardando dados reais de faturamento.</p>
                <p className="text-sm mt-1">Os gráficos históricos serão gerados conforme você lançar parcelas pagas.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 text-center">Saúde da Carteira</h3>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="h-56 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">{clients.length}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="text-center"><span className="block text-[10px] text-slate-500 font-bold uppercase">Pago</span><span className="text-sm font-bold text-primary dark:text-emerald-400">{clients.filter(c => c.status === 'Pago').length}</span></div>
                <div className="text-center"><span className="block text-[10px] text-slate-500 font-bold uppercase">Pendente</span><span className="text-sm font-bold text-secondary">{clients.filter(c => c.status === 'A Vencer').length}</span></div>
                <div className="text-center"><span className="block text-[10px] text-slate-500 font-bold uppercase">Atraso</span><span className="text-sm font-bold text-rose-500">{clients.filter(c => c.status === 'Atrasado').length}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
