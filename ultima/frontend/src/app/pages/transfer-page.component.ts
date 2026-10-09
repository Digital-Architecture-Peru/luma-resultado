import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { AccountsService } from '../core/accounts.service';
import { Account, Movement, SubmittedTransfer } from '../core/models';
import { TransfersService } from '../core/transfers.service';
import { AccountSelectorComponent } from '../molecules/account-selector.component';
import { MovementsTableComponent } from '../organisms/movements-table.component';
import { TransferFormComponent } from '../organisms/transfer-form.component';
import { TransactionLayoutComponent } from '../templates/transaction-layout.component';

@Component({
  selector: 'app-transfer-page',
  standalone: true,
  imports: [TransactionLayoutComponent, TransferFormComponent, MovementsTableComponent, AccountSelectorComponent],
  template: `
    <app-transaction-layout title="Transferencias entre mis cuentas">
      @if (message()) {
        <p class="status ok" role="status">{{ message() }}</p>
      }
      @if (error()) {
        <p class="status err" role="alert">{{ error() }}</p>
      }
      <app-transfer-form [accounts]="accounts()" [busy]="busy()" (submitted)="onSubmit($event)" />

      <div aside>
        <app-account-selector fieldId="view" label="Ver movimientos de" [control]="viewAccount" [accounts]="accounts()" />
        <app-movements-table [movements]="movements()" />
      </div>
    </app-transaction-layout>
  `,
})
export class TransferPageComponent implements OnInit {
  @ViewChild(TransferFormComponent) private form?: TransferFormComponent;

  readonly accounts = signal<Account[]>([]);
  readonly movements = signal<Movement[]>([]);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly busy = signal(false);
  readonly viewAccount = new FormControl<number | null>(null);

  constructor(
    private readonly accountsService: AccountsService,
    private readonly transfersService: TransfersService,
  ) {
    this.viewAccount.valueChanges.pipe(takeUntilDestroyed()).subscribe((id) => this.loadMovements(id));
  }

  ngOnInit(): void {
    this.refresh();
  }

  onSubmit({ request, idempotencyKey }: SubmittedTransfer): void {
    this.busy.set(true);
    this.message.set(null);
    this.error.set(null);
    this.transfersService.create(request, idempotencyKey).subscribe({
      next: () => {
        this.busy.set(false);
        this.message.set('Transferencia realizada correctamente.');
        this.form?.reset();
        this.refresh();
      },
      error: (e: HttpErrorResponse) => {
        this.busy.set(false);
        this.error.set(this.describe(e));
      },
    });
  }

  private refresh(): void {
    this.accountsService.list().subscribe({
      next: (list) => {
        this.accounts.set(list);
        this.viewAccount.setValue(this.viewAccount.value ?? list[0]?.id ?? null);
      },
      error: () => this.error.set('No se pudieron cargar las cuentas.'),
    });
  }

  private loadMovements(accountId: number | null): void {
    if (accountId === null) {
      this.movements.set([]);
      return;
    }
    this.accountsService.movements(accountId).subscribe({
      next: (m) => this.movements.set(m),
      error: () => this.error.set('No se pudieron cargar los movimientos.'),
    });
  }

  private describe(e: HttpErrorResponse): string {
    const detail = (e.error as { detail?: string } | null)?.detail;
    return detail ?? 'No se pudo completar la transferencia. Intenta nuevamente.';
  }
}
