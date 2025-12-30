import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    pill?: string;
    pillColor?: string;
    trend?: 'positive' | 'negative' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    iconBg,
    iconColor,
    pill,
    pillColor = 'bg-emerald-500/10 text-emerald-500',
    trend = 'neutral',
}) => {
    const trendColors = {
        positive: 'bg-emerald-500/10 text-emerald-500',
        negative: 'bg-rose-500/10 text-rose-500',
        neutral: pillColor,
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 transition-colors">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${iconBg}`}>
                    <span className={`material-symbols-outlined text-2xl ${iconColor}`}>{icon}</span>
                </div>
                {pill && (
                    <div
                        className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${trendColors[trend]}`}
                    >
                        {pill}
                    </div>
                )}
            </div>
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                    {title}
                </p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight sensitive-data">
                    {value}
                </h3>
            </div>
        </div>
    );
};

export default StatCard;
