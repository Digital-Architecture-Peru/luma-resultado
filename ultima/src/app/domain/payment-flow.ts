import { computed, signal } from '@angular/core';
import { Account, Card, PaymentMode, PaymentReceipt } from './models';
import { PaymentError, PaymentGateway } from './payment-gateway';
import { resolveAmount, validatePayment } from './payment-rules';

export type FlowStep = 'form' | 'review' | 'done';

/** Estado y casos de uso del pago de tarjeta; sin dependencias de UI ni de red. */
export class PaymentFlow {
  readonly cards = signal<Card[]>([]);
  readonly accounts = signal<Account[]>([]);
  readonly step = signal<FlowStep>('form');
  readonly cardId = signal<string | null>(null);
  readonly accountId = signal<string | null>(null);
  readonly mode = signal<PaymentMode>('minimum');
  readonly customAmount = signal<number | null>(null);
  readonly errors = signal<string[]>([]);
  readonly receipt = signal<PaymentReceipt | null>(null);
  readonly loading = signal(false);
  readonly loadError = signal<string | null>(null);

  readonly selectedCard = computed(() => this.cards().find((c) => c.id === this.cardId()) ?? null);
  readonly selectedAccount = computed(() => this.accounts().find((a) => a.id === this.accountId()) ?? null);
  readonly amount = computed(() => resolveAmount(this.selectedCard(), this.mode(), this.customAmount()));

  constructor(private readonly gateway: PaymentGateway) {}

  async load(): Promise<void> {
    this.loading.set(true);
    this.loadError.set(null);
    try {
      const [cards, accounts] = await Promise.all([this.gateway.listCards(), this.gateway.listAccounts()]);
      this.cards.set(cards);
      this.accounts.set(accounts);
    } catch {
      this.loadError.set('No pudimos cargar tus productos. Intenta nuevamente.');
    } finally {
      this.loading.set(false);
    }
  }

  selectCard(id: string): void {
    this.cardId.set(id);
    this.errors.set([]);
  }

  selectAccount(id: string): void {
    this.accountId.set(id);
    this.errors.set([]);
  }

  setMode(mode: PaymentMode): void {
    this.mode.set(mode);
    this.errors.set([]);
  }

  setCustomAmount(value: number | null): void {
    this.customAmount.set(value);
    this.errors.set([]);
  }

  review(): void {
    const errors = validatePayment(this.selectedCard(), this.selectedAccount(), this.amount());
    this.errors.set(errors);
    if (errors.length === 0) {
      this.step.set('review');
    }
  }

  back(): void {
    this.step.set('form');
  }

  async confirm(): Promise<void> {
    const card = this.selectedCard();
    const account = this.selectedAccount();
    if (card === null || account === null || this.loading()) {
      return;
    }
    this.loading.set(true);
    try {
      const receipt = await this.gateway.pay({ cardId: card.id, accountId: account.id, amount: this.amount() });
      this.receipt.set(receipt);
      this.step.set('done');
      await this.load();
    } catch (error) {
      this.errors.set(error instanceof PaymentError ? error.reasons : ['No se pudo procesar el pago.']);
      this.step.set('form');
    } finally {
      this.loading.set(false);
    }
  }

  reset(): void {
    this.step.set('form');
    this.cardId.set(null);
    this.accountId.set(null);
    this.mode.set('minimum');
    this.customAmount.set(null);
    this.errors.set([]);
    this.receipt.set(null);
  }
}
