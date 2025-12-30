import React from 'react';
import { ViewState } from '../../types';
import NavItem from './NavItem';
import Logo from '../Logo';

interface SidebarProps {
    currentView: ViewState;
    isSidebarOpen: boolean;
    isMobile: boolean;
    isDarkMode: boolean;
    isPrivacyMode: boolean;
    onNavigate: (view: ViewState) => void;
    onLogout: () => void;
    onToggleSidebar: () => void;
    onToggleTheme: () => void;
    onTogglePrivacy: () => void;
}

const navigationItems = [
    { icon: 'dashboard', label: 'Dashboard', view: ViewState.DASHBOARD },
    { icon: 'person_add', label: 'Novo Cliente', view: ViewState.NEW_CLIENT },
    { icon: 'attach_money', label: 'Gestão de Parcelas', view: ViewState.FINANCE_LIST },
    { icon: 'account_balance_wallet', label: 'Contas a Receber', view: ViewState.RECEIVABLES },
    { icon: 'compare_arrows', label: 'Comparativo', view: ViewState.COMPARISON },
    { icon: 'bar_chart', label: 'Relatórios', view: ViewState.FINANCE_REPORTS },
    { icon: 'domain', label: 'Empreendimentos', view: ViewState.DEVELOPMENTS },
    { icon: 'security', label: 'Segurança', view: ViewState.SETTINGS },
];

const Sidebar: React.FC<SidebarProps> = ({
    currentView,
    isSidebarOpen,
    isMobile,
    isDarkMode,
    isPrivacyMode,
    onNavigate,
    onLogout,
    onToggleSidebar,
    onToggleTheme,
    onTogglePrivacy,
}) => {
    return (
        <aside
            className={`
        flex flex-col transition-all duration-300 shadow-xl z-50 
        bg-white dark:bg-slate-950 text-slate-900 dark:text-white 
        border-r border-slate-200 dark:border-slate-800
        ${isMobile ? 'fixed inset-y-0 left-0 h-full' : 'relative h-full'}
        ${isSidebarOpen
                    ? 'w-64 translate-x-0'
                    : isMobile
                        ? '-translate-x-full w-64'
                        : 'w-20 translate-x-0'
                }
      `}
        >
            {/* Header */}
            <div className="h-20 flex items-center px-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div
                    className="flex items-center gap-2.5 cursor-pointer"
                    onClick={() => !isMobile && onToggleSidebar()}
                >
                    <div className="bg-primary/5 dark:bg-white/10 p-2 rounded-xl shrink-0 backdrop-blur-sm border border-slate-200 dark:border-white/5 text-primary dark:text-white">
                        <Logo className="w-7 h-7" />
                    </div>
                    {isSidebarOpen && (
                        <div className="flex flex-col overflow-hidden animate-fade-in">
                            <h1 className="text-xl font-black leading-none tracking-tight whitespace-nowrap text-slate-900 dark:text-white">
                                FinPay
                            </h1>
                            <span className="text-secondary text-[9px] font-bold uppercase tracking-tight mt-1.5 whitespace-nowrap">
                                Sistema de Gestão Imobiliária
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
                {navigationItems.map((item) => (
                    <NavItem
                        key={item.view}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentView === item.view}
                        isOpen={isSidebarOpen}
                        onClick={() => onNavigate(item.view)}
                    />
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 shrink-0">
                <button
                    onClick={onTogglePrivacy}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isPrivacyMode
                        ? 'bg-secondary/10 text-secondary'
                        : 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5'
                        } ${!isSidebarOpen ? 'justify-center' : ''}`}
                    title="Modo Apresentação (Privacidade)"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {isPrivacyMode ? 'visibility_off' : 'visibility'}
                    </span>
                    {isSidebarOpen && (
                        <span className="text-sm font-medium">Privacidade {isPrivacyMode ? 'ON' : 'OFF'}</span>
                    )}
                </button>

                <button
                    onClick={onToggleTheme}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white ${!isSidebarOpen ? 'justify-center' : ''
                        }`}
                    title="Alternar Tema"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {isDarkMode ? 'dark_mode' : 'light_mode'}
                    </span>
                    {isSidebarOpen && (
                        <span className="text-sm font-medium">Modo {isDarkMode ? 'Escuro' : 'Claro'}</span>
                    )}
                </button>

                <button
                    onClick={onLogout}
                    className={`mt-1 flex items-center gap-3 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white p-2 text-sm rounded-lg transition-colors ${!isSidebarOpen ? 'justify-center' : ''
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    {isSidebarOpen && <span className="font-medium">Sair</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
