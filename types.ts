
export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  FINANCE_LIST = 'FINANCE_LIST',
  FINANCE_REPORTS = 'FINANCE_REPORTS',
  WHATSAPP = 'WHATSAPP',
  NEW_CLIENT = 'NEW_CLIENT',
  RECEIVABLES = 'RECEIVABLES',
  DEVELOPMENTS = 'DEVELOPMENTS',
  SETTINGS = 'SETTINGS',
  COMPARISON = 'COMPARISON'
}

export interface Client {
  id: string;
  name: string;
  lot: string;
  status: 'paid' | 'late' | 'pending' | 'upcoming';
  value: number;
  dueDate: string;
  initials: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  source: string;
  lot: string;
  price: number;
  status: 'new' | 'negotiation' | 'closed' | 'lost';
  date: string;
  avatar?: string;
}
