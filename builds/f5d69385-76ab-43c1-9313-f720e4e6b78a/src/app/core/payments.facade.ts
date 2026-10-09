import { Injectable, inject, signal } from '@angular/core';
import { PaymentGateway, PaymentRejectedError } from './payment.gateway';
import { Account, Feedback, Payment, PaymentDraft } from './payment.model';

/** Fachada de UI: estado reactivo y casos de uso sobre el puerto PaymentGateway. */
@Injectable({ providedIn: 'root' })
export class PaymentsFacade {
  private readonly gateway = inject(PaymentGateway);

  readonly accounts = signal<Account[]>([]);
  readonly history = signal<Payment[]>([]);
  readonly feedback = signal<Feedback | null>(null);
  readonly busy = signal(false);

  async load(): Promise<void> {
    this.accounts.set(await this.gateway.listAccounts());
    this.history.set(await this.gateway.listPayments());
  }

  async pay(draft: PaymentDraft): Promise<boolean> {
    this.busy.set(true);
    this.feedback.set(null);
    try {
      const payment = await this.gateway.submit(draft);
      await this.load();
      this.feedback.set({ kind: 'success', message: `Pago ${payment.id} realizado correctamente.` });
      return true;
    } catch (error) {
      const message =
        error instanceof PaymentRejectedError ? error.message : 'No se pudo procesar el pago. Intenta de nuevo.';
      this.feedback.set({ kind: 'error', message });
      return false;
    } finally {
      this.busy.set(false);
    }
  }
}
