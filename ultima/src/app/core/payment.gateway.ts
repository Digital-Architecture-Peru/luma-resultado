import { Account, Payment, PaymentDraft } from './payment.model';

export class PaymentRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentRejectedError';
  }
}

/** Puerto de integración (aún sin definir): la UI solo depende de esta abstracción. */
export abstract class PaymentGateway {
  abstract listAccounts(): Promise<Account[]>;
  abstract listPayments(): Promise<Payment[]>;
  abstract submit(draft: PaymentDraft): Promise<Payment>;
}
