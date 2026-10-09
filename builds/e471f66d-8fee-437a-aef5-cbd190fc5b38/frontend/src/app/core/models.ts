export interface Account {
  id: number;
  number: string;
  holder: string;
  currency: string;
  balance: number;
}

export interface TransferRequest {
  sourceAccountId: number;
  targetAccountId: number;
  amount: number;
  currency: string;
  description: string;
}

export interface Transfer {
  id: number;
  status: string;
  sourceAccountId: number;
  targetAccountId: number;
  amount: number;
  currency: string;
  description: string | null;
  createdAt: string;
}

export interface Movement {
  id: number;
  transferId: number;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  createdAt: string;
}

export interface MovementPage {
  content: Movement[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
