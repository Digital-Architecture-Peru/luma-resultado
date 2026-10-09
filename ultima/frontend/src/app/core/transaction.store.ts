import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AccountService } from './account.service';
import { Account, Movement, TransferRequest } from './models';
import { TransferService } from './transfer.service';

export interface UiMessage {
  tone: 'ok' | 'error';
  text: string;
}

function errorText(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse && typeof err.error?.detail === 'string') {
    return err.error.detail;
  }
  return fallback;
}

/** Estado de la pantalla de transferencias con signals (sin dependencias extra). */
@Injectable({ providedIn: 'root' })
export class TransactionStore {
  private readonly accountApi = inject(AccountService);
  private readonly transferApi = inject(TransferService);

  readonly accounts = signal<Account[]>([]);
  readonly movements = signal<Movement[]>([]);
  readonly selectedAccountId = signal<number | null>(null);
  readonly busy = signal(false);
  readonly message = signal<UiMessage | null>(null);

  /** La clave se conserva entre reintentos de la misma solicitud para no duplicar cargos. */
  private pending: { signature: string; key: string } | null = null;

  loadAccounts(): void {
    this.accountApi.list().subscribe({
      next: (list) => {
        this.accounts.set(list);
        const current = this.selectedAccountId();
        if (current === null && list.length > 0) {
          this.selectAccount(list[0].id);
        }
      },
      error: (err) => this.message.set({ tone: 'error', text: errorText(err, 'No se pudieron cargar las cuentas.') }),
    });
  }

  selectAccount(accountId: number): void {
    this.selectedAccountId.set(accountId);
    this.accountApi.movements(accountId).subscribe({
      next: (page) => this.movements.set(page.content),
      error: (err) => this.message.set({ tone: 'error', text: errorText(err, 'No se pudieron cargar los movimientos.') }),
    });
  }

  submit(request: TransferRequest): void {
    const signature = JSON.stringify(request);
    if (this.pending?.signature !== signature) {
      this.pending = { signature, key: crypto.randomUUID() };
    }
    this.busy.set(true);
    this.message.set(null);
    this.transferApi
      .create(request, this.pending.key)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.pending = null;
          this.message.set({ tone: 'ok', text: 'Transferencia realizada con éxito.' });
          this.loadAccounts();
          this.selectAccount(request.sourceAccountId);
        },
        error: (err) =>
          this.message.set({ tone: 'error', text: errorText(err, 'No se pudo completar la transferencia.') }),
      });
  }
}
