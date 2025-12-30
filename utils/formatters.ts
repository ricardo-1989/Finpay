/**
 * Format a number as Brazilian currency (R$)
 */
export const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

/**
 * Format a number without currency symbol
 */
export const formatNumber = (value: number, decimals = 2): string => {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

/**
 * Format a date to Brazilian format (dd/mm/yyyy)
 */
export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date + 'T12:00:00') : date;
    return d.toLocaleDateString('pt-BR');
};

/**
 * Format date with time
 */
export const formatDateTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('pt-BR');
};

/**
 * Format a phone number to Brazilian format
 */
export const formatPhone = (phone: string): string => {
    const nums = phone.replace(/\D/g, '').slice(0, 11);
    if (!nums) return '';
    if (nums.length <= 2) return `(${nums}`;
    if (nums.length <= 6) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    if (nums.length <= 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
};

/**
 * Format a CPF number
 */
export const formatCPF = (cpf: string): string => {
    return cpf
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
};

/**
 * Format currency input (for forms)
 */
export const formatCurrencyInput = (value: string): string => {
    const nums = value.replace(/\D/g, '');
    if (!nums) return '';
    return (parseInt(nums) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
};

/**
 * Parse formatted currency string to number
 */
export const parseCurrency = (value: string): number => {
    const cleanVal = value.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanVal) || 0;
};

/**
 * Get initials from a name
 */
export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
};

/**
 * Get current date formatted
 */
export const getCurrentDateString = (): string => {
    const now = new Date();
    const monthStr = now.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    const formattedMonth = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
    return `Hoje, ${now.getDate()} ${formattedMonth} ${now.getFullYear()} - ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
};
