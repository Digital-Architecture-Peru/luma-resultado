import type { Card, TransactionRecord, TransactionRequest } from '../domain/types';

/** Puerto de integración (sin definir): se sustituirá por un adaptador HTTP. */
export interface TransactionGateway {
  listCards(): Promise<Card[]>;
  listTransactions(): Promise<TransactionRecord[]>;
  submit(request: TransactionRequest): Promise<TransactionRecord>;
}

export class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionError';
  }
}
