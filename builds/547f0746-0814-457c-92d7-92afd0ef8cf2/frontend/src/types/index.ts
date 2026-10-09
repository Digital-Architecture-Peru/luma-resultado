export interface Account {
  id: number;
  number: string;
  currency: string;
  balance: string;
}

export interface TransferInput {
  sourceAccountId: number;
  targetAccountId: number;
  amount: string;
  currency: string;
  description: string;
}

export interface TransferReceipt {
  id: number;
  sourceAccountId: number;
  targetAccountId: number;
  amount: string;
  currency: string;
  status: string;
  createdAt: string;
}

export interface TransfersClient {
  listAccounts(): Promise<Account[]>;
  createTransfer(input: TransferInput, idempotencyKey: string): Promise<TransferReceipt>;
}
