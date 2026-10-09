import { Component, OnInit, inject } from '@angular/core';
import { TransactionFacade } from '../../application/transaction.facade';
import { formatCents } from '../../domain/money';
import { TRANSACTION_LABELS } from '../../domain/transaction';
import { CardListComponent } from '../organisms/card-list.component';
import { TransactionFormComponent } from '../organisms/transaction-form.component';
import { TransactionHistoryComponent } from '../organisms/transaction-history.component';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [CardListComponent, TransactionFormComponent, TransactionHistoryComponent],
  template: `
    <main class="page">
      <h1>Transacciones de tarjetas</h1>

      @if (facade.loading()) {
        <p class="muted">Cargando tarjetas…</p>
      } @else {
        <app-card-list [cards]="facade.cards()" [selectedId]="facade.selectedId()" (selectCard)="facade.select($event)" />
        <app-transaction-form
          [card]="facade.selectedCard()"
          [submitting]="facade.submitting()"
          (submitted)="facade.submit($event)"
        />
      }

      @if (facade.error(); as message) {
        <p class="alert" role="alert">{{ message }}</p>
      }
      <div role="status" aria-live="polite">
        @if (facade.lastReceipt(); as r) {
          <p class="success">
            {{ typeLabel(r.type) }} por {{ money(r.amountCents) }} realizado. Referencia {{ r.reference }}.
          </p>
        }
      </div>

      <app-transaction-history [receipts]="facade.history()" />
    </main>
  `,
})
export class TransactionsPageComponent implements OnInit {
  protected readonly facade = inject(TransactionFacade);

  ngOnInit(): void {
    void this.facade.load();
  }

  protected money(cents: number): string {
    return formatCents(cents);
  }

  protected typeLabel(type: keyof typeof TRANSACTION_LABELS): string {
    return TRANSACTION_LABELS[type];
  }
}
