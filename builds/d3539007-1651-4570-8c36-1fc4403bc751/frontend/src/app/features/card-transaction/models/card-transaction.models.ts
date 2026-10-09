export interface CardView {
  id: string;
  maskedPan: string;
  brand: string;
  status: string;
  creditLimit: number;
  availableBalance: number;
}

export interface CreateTransactionRequest {
  amount: number;
  currency: string;
  sourceAccountId: string;
  description: string;
}

export interface TransactionCreated {
  transactionId: string;
  status: string;
}

export interface TransactionItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  createdAt: string;
}

export interface TransactionPage {
  items: TransactionItem[];
  page: number;
  size: number;
  total: number;
}

export interface SubmitTransactionEvent {
  cardId: string;
  request: CreateTransactionRequest;
}
