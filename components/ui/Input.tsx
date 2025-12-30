import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: string;
    error?: string;
    prefix?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    icon,
    error,
    prefix,
    className = '',
    ...props
}) => {
    return (
        <div className="flex flex-col">
            {label && (
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">{icon}</span>
                    </div>
                )}
                {prefix && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                        {prefix}
                    </span>
                )}
                <input
                    className={`w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 p-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-secondary transition-all ${icon ? 'pl-11' : ''
                        } ${prefix ? 'pl-11' : ''} ${error ? 'border-rose-500' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default Input;
