import { Account, Card, PaymentReceipt, PaymentRequest } from './models';
import { roundMoney, validatePayment } from './payment-rules';

/** Puerto de integración (aún sin definir): el adaptador real se enchufa aquí. */
export abstract class PaymentGateway {
  abstract listCards(): Promise<Card[]>;
  abstract listAccounts(): Promise<Account[]>;
  abstract pay(request: PaymentRequest): Promise<PaymentReceipt>;
}

export class PaymentError extends Error {
  constructor(readonly reasons: string[]) {
    super(reasons.join(' '));
    this.name = 'PaymentError';
  }
}

const SEED_CARDS: Card[] = [
  { id: 'c1', alias: 'Visa Platinum', maskedNumber: '**** 4821', brand: 'Visa', balance: 1250.75, minimumPayment: 85, status: 'active' },
  { id: 'c2', alias: 'Mastercard Gold', maskedNumber: '**** 7310', brand: 'Mastercard', balance: 340, minimumPayment: 25, status: 'active' },
  { id: 'c3', alias: 'Visa Clásica', maskedNumber: '**** 9902', brand: 'Visa', balance: 90, minimumPayment: 10, status: 'blocked' },
];

const SEED_ACCOUNTS: Account[] = [
  { id: 'a1', alias: 'Ahorros', maskedNumber: '**** 1100', available: 2400 },
  { id: 'a2', alias: 'Corriente', maskedNumber: '**** 2205', available: 300.5 },
];

/** Adaptador en memoria con datos ficticios; no persiste nada entre recargas. */
export class InMemoryPaymentGateway extends PaymentGateway {
  private cards: Card[] = SEED_CARDS.map((c) => ({ ...c }));
  private accounts: Account[] = SEED_ACCOUNTS.map((a) => ({ ...a }));
  private sequence = 0;

  constructor(private readonly now: () => Date = () => new Date()) {
    super();
  }

  async listCards(): Promise<Card[]> {
    return this.cards.map((c) => ({ ...c }));
  }

  async listAccounts(): Promise<Account[]> {
    return this.accounts.map((a) => ({ ...a }));
  }

  async pay(request: PaymentRequest): Promise<PaymentReceipt> {
    const card = this.cards.find((c) => c.id === request.cardId) ?? null;
    const account = this.accounts.find((a) => a.id === request.accountId) ?? null;
    const errors = validatePayment(card, account, request.amount);
    if (errors.length > 0 || card === null || account === null) {
      throw new PaymentError(errors);
    }
    const newCardBalance = roundMoney(card.balance - request.amount);
    const newAvailable = roundMoney(account.available - request.amount);
    this.cards = this.cards.map((c) =>
      c.id === card.id
        ? { ...c, balance: newCardBalance, minimumPayment: Math.min(c.minimumPayment, newCardBalance) }
        : c,
    );
    this.accounts = this.accounts.map((a) => (a.id === account.id ? { ...a, available: newAvailable } : a));
    this.sequence += 1;
    return {
      reference: `PAG-${String(this.sequence).padStart(6, '0')}`,
      cardId: card.id,
      accountId: account.id,
      amount: request.amount,
      date: this.now().toISOString(),
      newCardBalance,
    };
  }
}
