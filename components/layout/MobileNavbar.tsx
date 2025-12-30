import React from 'react';
import Logo from '../Logo';

interface MobileNavbarProps {
    onOpenSidebar: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ onOpenSidebar }) => {
    return (
        <div className="md:hidden h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between shrink-0 z-30">
            <button
                onClick={onOpenSidebar}
                className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-white transition-colors"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex items-center gap-2">
                <Logo className="w-6 h-6" />
                <span className="font-bold text-lg text-slate-900 dark:text-white">FinPay</span>
            </div>
            <div className="w-8"></div>
        </div>
    );
};

export default MobileNavbar;
