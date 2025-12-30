import React from 'react';

type BadgeVariant = 'paid' | 'pending' | 'late' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
    variant: BadgeVariant;
    children: React.ReactNode;
    size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
    paid: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20',
    pending: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20',
    late: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20',
    warning: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20',
    danger: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20',
    info: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20',
};

const sizeStyles = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-3 py-1 text-[10px]',
};

const Badge: React.FC<BadgeProps> = ({ variant, children, size = 'md' }) => {
    return (
        <span
            className={`inline-flex rounded-md font-black uppercase tracking-wider border ${variantStyles[variant]} ${sizeStyles[size]}`}
        >
            {children}
        </span>
    );
};

// Helper to convert status string to badge variant
export const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
        case 'Pago':
            return 'paid';
        case 'A Vencer':
            return 'pending';
        case 'Atrasado':
            return 'late';
        default:
            return 'info';
    }
};

export default Badge;
