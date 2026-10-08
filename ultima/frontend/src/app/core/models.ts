export type CardStatus = 'Active' | 'Blocked' | 'Expired';

export interface Card {
  id: string;
  maskedPan: string;
  brand: string;
  product: string;
  status: CardStatus;
  creditLimit: number;
  available: number;
  currency: string;
  expiry: string;
}

export interface Movement {
  id: string;
  postedAt: string;
  description: string;
  amount: number;
  currency: string;
}

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export type LoadState = 'loading' | 'ready' | 'error';
