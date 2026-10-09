import { Component, computed, input, output, signal } from '@angular/core';
import { Card, maskedNumber } from '../../domain/card';
import { parseAmountToCents } from '../../domain/money';
import {
  MAX_DESCRIPTION_LENGTH,
  TRANSACTION_LABELS,
  TransactionRequest,
  TransactionType,
  hasErrors,
  validateTransaction,
} from '../../domain/transaction';
import { UiButtonComponent } from '../atoms/ui-button.component';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <section aria-labelledby="form-title">
      <h2 id="form-title">Nueva transacción</h2>
      @if (card(); as c) {
        <p class="muted">Tarjeta: {{ c.alias }} · {{ number(c) }}</p>
      }
      <form (submit)="onSubmit($event)" novalidate>
        <label for="tx-type">Tipo de transacción</label>
        <select id="tx-type" [value]="type()" (change)="onType($event)">
          @for (option of options; track option.value) {
            <option [value]="option.value" [selected]="option.value === type()">{{ option.label }}</option>
          }
        </select>

        <label for="tx-amount">Monto (USD)</label>
        <input
          id="tx-amount"
          inputmode="decimal"
          autocomplete="off"
          placeholder="0.00"
          [value]="amountText()"
          [attr.aria-invalid]="visibleErrors().amount ? 'true' : null"
          (input)="onAmount($event)"
        />
        @if (visibleErrors().amount; as message) {
          <p class="field-error">{{ message }}</p>
        }

        <label for="tx-desc">Descripción (opcional)</label>
        <input
          id="tx-desc"
          [value]="description()"
          [attr.maxlength]="maxDescription * 2"
          [attr.aria-invalid]="visibleErrors().description ? 'true' : null"
          (input)="onDescription($event)"
        />
        @if (visibleErrors().description; as message) {
          <p class="field-error">{{ message }}</p>
        }
        @if (visibleErrors().card; as message) {
          <p class="field-error">{{ message }}</p>
        }

        <app-button type="submit" [label]="submitting() ? 'Procesando…' : 'Confirmar transacción'" [disabled]="submitting()" />
      </form>
    </section>
  `,
})
export class TransactionFormComponent {
  readonly card = input<Card | undefined>(undefined);
  readonly submitting = input(false);
  readonly submitted = output<TransactionRequest>();

  protected readonly maxDescription = MAX_DESCRIPTION_LENGTH;
  protected readonly options: readonly { value: TransactionType; label: string }[] = (
    Object.keys(TRANSACTION_LABELS) as TransactionType[]
  ).map((value) => ({ value, label: TRANSACTION_LABELS[value] }));

  protected readonly type = signal<TransactionType>('PAYMENT');
  protected readonly amountText = signal('');
  protected readonly description = signal('');
  private readonly touched = signal(false);

  private readonly request = computed<TransactionRequest>(() => ({
    cardId: this.card()?.id ?? '',
    type: this.type(),
    amountCents: parseAmountToCents(this.amountText()),
    description: this.description(),
  }));

  private readonly errors = computed(() => validateTransaction(this.card(), this.request()));
  protected readonly visibleErrors = computed(() => (this.touched() ? this.errors() : {}));

  protected number(card: Card): string {
    return maskedNumber(card);
  }

  protected onType(event: Event): void {
    this.type.set((event.target as HTMLSelectElement).value as TransactionType);
  }

  protected onAmount(event: Event): void {
    this.amountText.set((event.target as HTMLInputElement).value);
  }

  protected onDescription(event: Event): void {
    this.description.set((event.target as HTMLInputElement).value);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.touched.set(true);
    if (this.submitting() || hasErrors(this.errors())) {
      return;
    }
    this.submitted.emit(this.request());
    this.amountText.set('');
    this.description.set('');
    this.touched.set(false);
  }
}
