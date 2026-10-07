import { Card, Transaction, TransactionRequest } from './card.model';

/** Puerto de integración (sin definir): lo implementa un adaptador en infrastructure/. */
export abstract class CardsGateway {
  abstract listCards(): Promise<Card[]>;
  abstract listTransactions(cardId: string): Promise<Transaction[]>;
  /** Debe lanzar TransactionRejectedError si el servicio rechaza la operación. */
  abstract submit(request: TransactionRequest): Promise<Transaction>;
}
