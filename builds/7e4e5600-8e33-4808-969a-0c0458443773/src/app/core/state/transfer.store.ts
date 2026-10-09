import { Injectable, inject, signal } from '@angular/core';
import { forkJoin, switchMap, tap } from 'rxjs';
import { Account, Movement, RequestStatus, TransferRequest } from '../models/account.model';
import { AccountsGateway } from '../ports/accounts.gateway';

/** Fachada de estado para la pantalla de transferencias (signals). */
@Injectable({ providedIn: 'root' })
export class TransferStore {
  private readonly gateway = inject(AccountsGateway);

  readonly accounts = signal<Account[]>([]);
  readonly movements = signal<Movement[]>([]);
  readonly status = signal<RequestStatus>('idle');
  readonly message = signal('');

  load(): void {
    this.status.set('loading');
    this.refresh().subscribe({
      next: () => this.status.set('idle'),
      error: () => this.fail('No se pudo cargar la información de cuentas.'),
    });
  }

  submit(request: TransferRequest, onSuccess?: () => void): void {
    this.status.set('loading');
    this.message.set('');
    this.gateway
      .transfer(request)
      .pipe(
        switchMap((movement) => this.refresh().pipe(tap(() => this.succeed(movement)))),
      )
      .subscribe({
        next: () => onSuccess?.(),
        error: (err: unknown) =>
          this.fail(err instanceof Error ? err.message : 'No se pudo completar la transferencia.'),
      });
  }

  private refresh() {
    return forkJoin({
      accounts: this.gateway.listAccounts(),
      movements: this.gateway.listMovements(),
    }).pipe(
      tap(({ accounts, movements }) => {
        this.accounts.set(accounts);
        this.movements.set(movements);
      }),
    );
  }

  private succeed(movement: Movement): void {
    this.status.set('success');
    this.message.set(`Transferencia realizada. Referencia ${movement.reference}.`);
  }

  private fail(message: string): void {
    this.status.set('error');
    this.message.set(message);
  }
}
