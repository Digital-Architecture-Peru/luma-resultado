import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { AppButton } from '../atoms/app-button';
import { FormField } from '../molecules/form-field';
import {
  Card,
  TRANSACTION_TYPE_LABELS,
  TransactionRequest,
  TransactionType,
} from '../domain/card.model';
import { parseAmount, validateTransaction } from '../domain/transaction.validation';

@Component({
  selector: 'app-transaction-form',
  imports: [AppButton, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="panel" novalidate (submit)="onSubmit($event)">
      <h2>Nueva transacción</h2>

      <app-form-field label="Tarjeta" controlId="card">
        <select id="card" name="card" (change)="onCardChange($event)">
          @for (card of cards(); track card.id) {
            <option [value]="card.id" [selected]="card.id === selectedCardId()">
              {{ card.alias }} · {{ card.maskedNumber }}
            </option>
          }
        </select>
      </app-form-field>

      <app-form-field label="Tipo de operación" controlId="type">
        <select id="type" name="type" (change)="onTypeChange($event)">
          @for (option of typeOptions; track option.value) {
            <option [value]="option.value" [selected]="option.value === type()">
              {{ option.label }}
            </option>
          }
        </select>
      </app-form-field>

      <app-form-field label="Monto" controlId="amount">
        <input
          id="amount"
          name="amount"
          inputmode="decimal"
          autocomplete="off"
          placeholder="0.00"
          [value]="amount()"
          (input)="amount.set(valueOf($event))"
        />
      </app-form-field>

      <app-form-field label="Descripción" controlId="description">
        <input
          id="description"
          name="description"
          autocomplete="off"
          maxlength="60"
          [value]="description()"
          (input)="description.set(valueOf($event))"
        />
      </app-form-field>

      @if (errors().length > 0) {
        <ul class="error-list" role="alert">
          @for (message of errors(); track message) {
            <li>{{ message }}</li>
          }
        </ul>
      }

      <app-button
        type="submit"
        [label]="busy() ? 'Procesando…' : 'Confirmar transacción'"
        [disabled]="busy()"
      />
    </form>
  `,
})
export class TransactionForm {
  readonly cards = input.required<Card[]>();
  readonly selectedCardId = input<string | null>(null);
  readonly busy = input(false);

  readonly cardChange = output<string>();
  readonly submitted = output<TransactionRequest>();

  protected readonly typeOptions = (Object.keys(TRANSACTION_TYPE_LABELS) as TransactionType[]).map(
    (value) => ({ value, label: TRANSACTION_TYPE_LABELS[value] }),
  );

  protected readonly type = signal<TransactionType>('PURCHASE');
  protected readonly amount = signal('');
  protected readonly description = signal('');
  protected readonly errors = signal<string[]>([]);

  private readonly selectedCard = computed(
    () => this.cards().find((card) => card.id === this.selectedCardId()),
  );

  protected valueOf(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected onCardChange(event: Event): void {
    this.errors.set([]);
    this.cardChange.emit(this.valueOf(event));
  }

  protected onTypeChange(event: Event): void {
    this.type.set(this.valueOf(event) as TransactionType);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    const card = this.selectedCard();
    const request: TransactionRequest = {
      cardId: card?.id ?? '',
      type: this.type(),
      amount: parseAmount(this.amount()),
      description: this.description().trim(),
    };
    const errors = validateTransaction(request, card);
    this.errors.set(errors);
    if (errors.length === 0) {
      this.submitted.emit(request);
      this.amount.set('');
      this.description.set('');
    }
  }
}
