import { Injectable, computed, inject, signal } from '@angular/core';
import { ACCOUNTS_GATEWAY } from '../../../core/accounts/accounts.gateway';
import { Account, GatewayError, TransferDraft, TransferReceipt } from '../../../core/accounts/model';

export type TransferStep = 'capture' | 'confirm' | 'receipt';

const GENERIC_ERROR = 'Ocurrió un error inesperado. Inténtalo nuevamente.';

function newOperationId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `op-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Estado de la feature (solo en memoria; se pierde al recargar). Se provee a nivel de página. */
@Injectable()
export class TransferStore {
  private readonly gateway = inject(ACCOUNTS_GATEWAY);
  private operationId: string | null = null;

  readonly accounts = signal<Account[]>([]);
  readonly step = signal<TransferStep>('capture');
  readonly draft = signal<TransferDraft | null>(null);
  readonly receipt = signal<TransferReceipt | null>(null);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly fromAccount = computed(() => this.accounts().find((a) => a.id === this.draft()?.fromId) ?? null);
  readonly toAccount = computed(() => this.accounts().find((a) => a.id === this.draft()?.toId) ?? null);

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.gateway.listAccounts().subscribe({
      next: (accounts) => {
        this.accounts.set(accounts);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.messageOf(err));
        this.loading.set(false);
      },
    });
  }

  review(draft: TransferDraft): void {
    this.draft.set(draft);
    this.operationId = newOperationId();
    this.error.set(null);
    this.step.set('confirm');
  }

  back(): void {
    if (this.submitting()) {
      return;
    }
    this.error.set(null);
    this.step.set('capture');
  }

  confirm(): void {
    const draft = this.draft();
    if (this.submitting() || !draft || !this.operationId) {
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    // Se conserva operationId: un reintento tras error no duplica el movimiento.
    this.gateway.transfer({ ...draft, operationId: this.operationId }).subscribe({
      next: (receipt) => {
        this.receipt.set(receipt);
        this.submitting.set(false);
        this.step.set('receipt');
        this.gateway.listAccounts().subscribe({ next: (accounts) => this.accounts.set(accounts) });
      },
      error: (err) => {
        this.error.set(this.messageOf(err));
        this.submitting.set(false);
      },
    });
  }

  reset(): void {
    this.draft.set(null);
    this.receipt.set(null);
    this.error.set(null);
    this.operationId = null;
    this.step.set('capture');
  }

  private messageOf(err: unknown): string {
    return err instanceof GatewayError ? err.message : GENERIC_ERROR;
  }
}
