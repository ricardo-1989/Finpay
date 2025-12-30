import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

const roundedStyles = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
};

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    rounded = '2xl',
}) => {
    return (
        <div
            className={`bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors ${paddingStyles[padding]} ${roundedStyles[rounded]} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
