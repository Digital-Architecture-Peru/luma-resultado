import { Injectable } from '@angular/core';
import { PaymentGateway, PaymentRejectedError } from './payment.gateway';
import { Account, Payment, PaymentDraft } from './payment.model';
import { hasErrors, parseAmount, validatePayment } from './payment.validator';

/** Adaptador ficticio en memoria (sin persistencia ni llamadas reales). */
@Injectable()
export class InMemoryPaymentGateway extends PaymentGateway {
  private accounts: Account[] = [
    { id: 'ACC-001', name: 'Cuenta de ahorros ****1234', balance: 8500.5 },
    { id: 'ACC-002', name: 'Cuenta corriente ****5678', balance: 1200 },
  ];
  private payments: Payment[] = [];
  private sequence = 0;

  async listAccounts(): Promise<Account[]> {
    return this.accounts.map((a) => ({ ...a }));
  }

  async listPayments(): Promise<Payment[]> {
    return [...this.payments];
  }

  async submit(draft: PaymentDraft): Promise<Payment> {
    if (hasErrors(validatePayment(draft, this.accounts))) {
      throw new PaymentRejectedError('El pago no cumple las reglas de validación.');
    }
    const amount = parseAmount(draft.amount) as number;
    this.accounts = this.accounts.map((a) =>
      a.id === draft.sourceAccountId ? { ...a, balance: Math.round((a.balance - amount) * 100) / 100 } : a,
    );
    this.sequence += 1;
    const payment: Payment = {
      id: `PAY-${String(this.sequence).padStart(5, '0')}`,
      sourceAccountId: draft.sourceAccountId,
      beneficiary: draft.beneficiary.trim(),
      amount,
      concept: draft.concept.trim(),
      createdAt: new Date().toISOString(),
      status: 'completed',
    };
    this.payments = [payment, ...this.payments];
    return payment;
  }
}
