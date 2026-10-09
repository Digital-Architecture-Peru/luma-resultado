import { ChangeDetectionStrategy, Component, OnInit, inject, viewChild } from '@angular/core';
import { TransferRequest } from './core/models/account.model';
import { TransferStore } from './core/state/transfer.store';
import { AccountListComponent } from './organisms/account-list.component';
import { MovementListComponent } from './organisms/movement-list.component';
import { TransferFormComponent } from './organisms/transfer-form.component';

/** Página: compone los organismos de la transferencia entre cuentas. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccountListComponent, MovementListComponent, TransferFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="container">
      <h1>Transferencias entre mis cuentas</h1>

      <p class="status" role="status" aria-live="polite" [class.status-error]="store.status() === 'error'">
        @switch (store.status()) {
          @case ('loading') { Procesando… }
          @default { {{ store.message() }} }
        }
      </p>

      <app-account-list [accounts]="store.accounts()" />
      <app-transfer-form [accounts]="store.accounts()" [busy]="store.status() === 'loading'"
        (submitted)="onSubmit($event)" />
      <app-movement-list [movements]="store.movements()" [accounts]="store.accounts()" />
    </main>
  `,
})
export class AppComponent implements OnInit {
  protected readonly store = inject(TransferStore);
  private readonly form = viewChild(TransferFormComponent);

  ngOnInit(): void {
    this.store.load();
  }

  protected onSubmit(request: TransferRequest): void {
    this.store.submit(request, () => this.form()?.reset());
  }
}
