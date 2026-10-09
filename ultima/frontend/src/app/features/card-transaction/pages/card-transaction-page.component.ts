import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, signal } from '@angular/core';
import { AppAlertComponent } from '../../../shared/ui/atoms/app-alert.component';
import { CardSummaryComponent } from '../../../shared/ui/molecules/card-summary.component';
import { TransactionFormComponent } from '../../../shared/ui/organisms/transaction-form.component';
import { TransactionHistoryComponent } from '../../../shared/ui/organisms/transaction-history.component';
import { TransactionTemplateComponent } from '../../../shared/ui/templates/transaction-template.component';
import { CardView, SubmitTransactionEvent, TransactionItem } from '../models/card-transaction.models';
import { CardTransactionService } from '../services/card-transaction.service';

@Component({
  selector: 'app-card-transaction-page',
  standalone: true,
  imports: [
    AppAlertComponent,
    CardSummaryComponent,
    TransactionFormComponent,
    TransactionHistoryComponent,
    TransactionTemplateComponent,
  ],
  template: `
    <app-transaction-template>
      <app-card-summary slot="summary" [card]="selectedCard()" />
      <app-transaction-form slot="form" [cards]="cards()" [busy]="busy()" (submitted)="onSubmit($event)" />
      <div slot="messages">
        <app-alert [message]="success()" kind="success" />
        <app-alert [message]="error()" kind="error" />
      </div>
      <app-transaction-history slot="history" [items]="history()" />
    </app-transaction-template>
  `,
})
export class CardTransactionPageComponent implements OnInit {
  readonly cards = signal<CardView[]>([]);
  readonly history = signal<TransactionItem[]>([]);
  readonly busy = signal(false);
  readonly success = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  private readonly selectedId = signal<string | null>(null);
  readonly selectedCard = computed(() => this.cards().find((c) => c.id === this.selectedId()) ?? null);

  /** Se conserva entre reintentos por fallo de red para no duplicar la transaccion. */
  private pendingKey: string | null = null;

  constructor(private readonly service: CardTransactionService) {}

  ngOnInit(): void {
    this.service.listCards().subscribe({
      next: (cards) => {
        this.cards.set(cards);
        if (cards.length > 0) {
          this.select(cards[0].id);
        }
      },
      error: () => this.error.set('No se pudieron cargar las tarjetas'),
    });
  }

  onSubmit(event: SubmitTransactionEvent): void {
    const key = this.pendingKey ?? crypto.randomUUID();
    this.pendingKey = key;
    this.busy.set(true);
    this.success.set(null);
    this.error.set(null);
    this.service.createTransaction(event.cardId, event.request, key).subscribe({
      next: (created) => {
        this.pendingKey = null;
        this.busy.set(false);
        this.success.set(`Transaccion ${created.status}`);
        this.refresh(event.cardId);
      },
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        if (err.status >= 400 && err.status < 500) {
          this.pendingKey = null;
        }
        this.error.set(err.error?.detail ?? 'No se pudo completar la transaccion');
      },
    });
  }

  private select(cardId: string): void {
    this.selectedId.set(cardId);
    this.service.history(cardId).subscribe((page) => this.history.set(page.items));
  }

  private refresh(cardId: string): void {
    this.service.listCards().subscribe((cards) => this.cards.set(cards));
    this.select(cardId);
  }
}
