import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TransactionsStore } from '../application/transactions.store';
import { TransactionRequest } from '../domain/card.model';
import { CardSummary } from '../molecules/card-summary';
import { TransactionForm } from '../organisms/transaction-form';
import { TransactionHistory } from '../organisms/transaction-history';

@Component({
  selector: 'app-card-transactions-page',
  imports: [CardSummary, TransactionForm, TransactionHistory],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="page">
      <h1>Tarjetas · Transacciones</h1>

      <div role="status" aria-live="polite">
        @if (store.receipt(); as receipt) {
          <p class="notice-ok">
            Transacción aprobada. Referencia {{ receipt.id }} por {{ receipt.amount }}.
          </p>
        }
      </div>
      @if (store.error(); as message) {
        <p class="notice-error" role="alert">{{ message }}</p>
      }

      <div class="layout">
        <div>
          @if (store.selectedCard(); as card) {
            <app-card-summary [card]="card" />
          }
          <app-transaction-form
            [cards]="store.cards()"
            [selectedCardId]="store.selectedCardId()"
            [busy]="store.busy()"
            (cardChange)="store.select($event)"
            (submitted)="onSubmitted($event)"
          />
        </div>
        <app-transaction-history
          [transactions]="store.history()"
          [currency]="store.selectedCard()?.currency ?? 'PEN'"
        />
      </div>
    </main>
  `,
})
export class CardTransactionsPage implements OnInit {
  protected readonly store = inject(TransactionsStore);

  ngOnInit(): void {
    void this.store.load();
  }

  protected onSubmitted(request: TransactionRequest): void {
    void this.store.submit(request);
  }
}
