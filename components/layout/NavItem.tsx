import React from 'react';

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
  badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, isOpen, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${
      isActive
        ? 'bg-primary/10 text-primary dark:bg-white/10 dark:text-white'
        : 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
    } ${!isOpen ? 'justify-center' : ''}`}
    title={!isOpen ? label : ''}
  >
    <span
      className={`material-symbols-outlined ${
        isActive
          ? 'text-primary dark:text-secondary'
          : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'
      }`}
    >
      {icon}
    </span>
    {isOpen && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
    {badge && isOpen && (
      <span className="ml-auto bg-secondary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
        {badge}
      </span>
    )}
  </button>
);

export default NavItem;
