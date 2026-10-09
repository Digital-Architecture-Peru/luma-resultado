import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CardsApiService } from '../core/cards-api.service';
import { Card, CardTransaction } from '../core/models';
import { CardSummaryComponent } from '../molecules/card-summary.component';
import { PaymentFormComponent, PaymentFormValue } from '../organisms/payment-form.component';
import { TransactionsTableComponent } from '../organisms/transactions-table.component';
import { CardsLayoutComponent } from '../templates/cards-layout.component';

@Component({
  selector: 'app-card-payment-page',
  standalone: true,
  imports: [CardsLayoutComponent, CardSummaryComponent, PaymentFormComponent, TransactionsTableComponent],
  template: `
    <app-cards-layout title="Pago de tarjeta de crédito">
      @if (cards().length > 1) {
        <label for="card-select">Tarjeta</label>
        <select id="card-select" class="input" (change)="select($any($event.target).value)">
          @for (c of cards(); track c.id) {
            <option [value]="c.id" [selected]="c.id === selectedId()">{{ c.alias }}</option>
          }
        </select>
      }
      @if (error()) {
        <p class="alert" role="alert">{{ error() }}</p>
      }
      @if (message()) {
        <p class="success" role="status">{{ message() }}</p>
      }
      @if (selected(); as card) {
        <app-card-summary [card]="card" />
        <app-payment-form [currency]="card.currency" [busy]="busy()" (submitted)="pay($event)" />
        <app-transactions-table [transactions]="transactions()" />
      } @else if (!error()) {
        <p class="muted" role="status">Cargando tarjetas…</p>
      }
    </app-cards-layout>
  `,
})
export class CardPaymentPageComponent implements OnInit {
  private readonly api = inject(CardsApiService);

  readonly cards = signal<Card[]>([]);
  readonly selectedId = signal<string | null>(null);
  readonly transactions = signal<CardTransaction[]>([]);
  readonly busy = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  readonly selected = computed(() => this.cards().find((c) => c.id === this.selectedId()) ?? null);

  // Se reutiliza ante fallos de red/5xx para que un reintento no duplique el cargo.
  private idempotencyKey = crypto.randomUUID();

  ngOnInit(): void {
    this.loadCards();
  }

  select(cardId: string): void {
    this.selectedId.set(cardId);
    this.message.set('');
    this.loadTransactions(cardId);
  }

  pay(value: PaymentFormValue): void {
    const card = this.selected();
    if (!card || this.busy()) return;

    this.busy.set(true);
    this.message.set('');
    this.error.set('');
    const request = { amount: value.amount, currency: card.currency, sourceAccountAlias: value.sourceAccountAlias };

    this.api.pay(card.id, request, this.idempotencyKey).subscribe({
      next: () => {
        this.idempotencyKey = crypto.randomUUID();
        this.busy.set(false);
        this.message.set('Pago aplicado correctamente.');
        this.loadCards(card.id);
      },
      error: (e: HttpErrorResponse) => {
        if (e.status >= 400 && e.status < 500) this.idempotencyKey = crypto.randomUUID();
        this.busy.set(false);
        this.error.set(e.error?.detail ?? 'No se pudo procesar el pago. Intenta nuevamente.');
      },
    });
  }

  private loadCards(keepSelected?: string): void {
    this.api.listCards().subscribe({
      next: (cards) => {
        this.cards.set(cards);
        const target = cards.find((c) => c.id === keepSelected)?.id ?? cards[0]?.id;
        if (target) {
          this.selectedId.set(target);
          this.loadTransactions(target);
        }
      },
      error: () => this.error.set('No se pudieron cargar las tarjetas.'),
    });
  }

  private loadTransactions(cardId: string): void {
    this.api.listTransactions(cardId).subscribe({
      next: (items) => this.transactions.set(items),
      error: () => this.error.set('No se pudieron cargar los movimientos.'),
    });
  }
}
