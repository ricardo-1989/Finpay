import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'whatsapp' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: string;
    iconPosition?: 'left' | 'right';
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 dark:bg-slate-700',
    secondary:
        'bg-secondary text-white hover:bg-orange-600 shadow-lg shadow-secondary/20',
    whatsapp:
        'bg-whatsapp text-white hover:bg-emerald-600 shadow-lg shadow-whatsapp/20',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20',
    ghost: 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800',
    outline:
        'border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-sm',
};

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    isLoading = false,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles =
        'inline-flex items-center justify-center gap-2 rounded-xl font-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''
                } ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <span className="material-symbols-outlined text-lg">{icon}</span>
                    )}
                    {children}
                    {icon && iconPosition === 'right' && (
                        <span className="material-symbols-outlined text-lg">{icon}</span>
                    )}
                </>
            )}
        </button>
    );
};

export default Button;
