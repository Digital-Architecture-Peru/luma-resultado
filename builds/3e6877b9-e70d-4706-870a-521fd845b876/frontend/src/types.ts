export interface Card {
  id: string;
  last4: string;
  brand: string;
  creditLimit: string;
  balance: string;
}

export interface Account {
  id: string;
  alias: string;
  balance: string;
}

export interface Transaction {
  id: string;
  type: 'PURCHASE' | 'PAYMENT';
  amount: string;
  status: string;
  createdAt: string;
}

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export interface PaymentResult {
  transactionId: string;
  cardId: string;
  amount: string;
  status: string;
  createdAt: string;
}
