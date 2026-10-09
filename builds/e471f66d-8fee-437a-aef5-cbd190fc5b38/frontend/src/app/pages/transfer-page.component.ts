import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TransactionStore } from '../core/transaction.store';
import { MovementListComponent } from '../organisms/movement-list.component';
import { TransferFormComponent } from '../organisms/transfer-form.component';
import { TransactionLayoutComponent } from '../templates/transaction-layout.component';

@Component({
  selector: 'app-transfer-page',
  standalone: true,
  imports: [DecimalPipe, TransactionLayoutComponent, TransferFormComponent, MovementListComponent],
  template: `<app-transaction-layout
    title="Transferencia entre mis cuentas"
    subtitle="Mueva fondos entre sus cuentas de la misma moneda.">
    <div main>
      <app-transfer-form [accounts]="store.accounts()" [busy]="store.busy()" (submitted)="store.submit($event)" />
      @if (store.message(); as m) {
        <p role="status" class="msg" [class.msg-ok]="m.tone === 'ok'" [class.msg-error]="m.tone === 'error'">{{ m.text }}</p>
      }
    </div>
    <div aside>
      <h2>Mis cuentas</h2>
      @if (store.accounts().length === 0) {
        <p class="muted">No hay cuentas para mostrar.</p>
      }
      <ul class="accounts">
        @for (a of store.accounts(); track a.id) {
          <li>
            <button type="button" class="account" [attr.aria-pressed]="a.id === store.selectedAccountId()" (click)="store.selectAccount(a.id)">
              <span>{{ a.number }}</span>
              <strong>{{ a.currency }} {{ a.balance | number: '1.2-2' }}</strong>
            </button>
          </li>
        }
      </ul>
      <h2>Movimientos</h2>
      <app-movement-list [movements]="store.movements()" />
    </div>
  </app-transaction-layout>`,
})
export class TransferPageComponent implements OnInit {
  protected readonly store = inject(TransactionStore);

  ngOnInit(): void {
    this.store.loadAccounts();
  }
}
