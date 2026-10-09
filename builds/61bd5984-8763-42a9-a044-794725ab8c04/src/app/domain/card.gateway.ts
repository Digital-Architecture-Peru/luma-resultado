import { Card } from './card';
import { TransactionReceipt, TransactionRequest } from './transaction';

/** Puerto de integración (sin definir): la implementación real se inyecta en app.config. */
export abstract class CardGateway {
  abstract listCards(): Promise<readonly Card[]>;
  abstract execute(request: TransactionRequest): Promise<TransactionReceipt>;
}
