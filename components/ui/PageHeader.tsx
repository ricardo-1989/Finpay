import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string;
    badgeColor?: string;
    icon?: string;
    iconBg?: string;
    actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    badge,
    badgeColor = 'bg-secondary/10 text-secondary border-secondary/20',
    icon,
    iconBg = 'bg-secondary/10',
    actions,
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
            <div className="flex items-start gap-4">
                {icon && (
                    <div className={`${iconBg} p-3 rounded-2xl hidden md:flex`}>
                        <span className="material-symbols-outlined text-secondary text-2xl filled">{icon}</span>
                    </div>
                )}
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {title}
                        </h1>
                        {badge && (
                            <span
                                className={`${badgeColor} px-3 py-1 rounded-full text-[10px] font-black uppercase border`}
                            >
                                {badge}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
};

export default PageHeader;
