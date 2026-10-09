import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardView, SubmitTransactionEvent } from '../../../features/card-transaction/models/card-transaction.models';
import { AppButtonComponent } from '../atoms/app-button.component';
import { FormFieldComponent } from '../molecules/form-field.component';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, AppButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="form" novalidate>
      <app-form-field label="Tarjeta" inputId="cardId">
        <select id="cardId" formControlName="cardId">
          @for (c of cards; track c.id) {
            <option [value]="c.id">{{ c.brand }} {{ c.maskedPan }}</option>
          }
        </select>
      </app-form-field>
      <app-form-field label="Monto" inputId="amount" [error]="errorFor('amount')">
        <input id="amount" type="number" step="0.01" formControlName="amount" />
      </app-form-field>
      <app-form-field label="Moneda (ISO-4217)" inputId="currency" [error]="errorFor('currency')">
        <input id="currency" maxlength="3" formControlName="currency" />
      </app-form-field>
      <app-form-field label="Cuenta origen" inputId="sourceAccountId" [error]="errorFor('sourceAccountId')">
        <input id="sourceAccountId" maxlength="40" formControlName="sourceAccountId" />
      </app-form-field>
      <app-form-field label="Descripcion" inputId="description" [error]="errorFor('description')">
        <input id="description" maxlength="140" formControlName="description" />
      </app-form-field>
      <app-button type="submit" [disabled]="busy">Realizar transaccion</app-button>
    </form>
  `,
  styles: [`
    .form { display: grid; gap: var(--space-4); max-inline-size: 28rem; }
    input, select { min-height: 2.5rem; padding: 0 var(--space-2); border: 1px solid var(--border); border-radius: var(--radius-md); font: inherit; background: var(--surface); color: var(--text); }
  `],
})
export class TransactionFormComponent {
  @Input() cards: CardView[] = [];
  @Input() busy = false;
  @Output() submitted = new EventEmitter<SubmitTransactionEvent>();

  readonly form = new FormGroup({
    cardId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    currency: new FormControl('USD', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[A-Z]{3}$/)] }),
    sourceAccountId: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(40)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(140)] }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { cardId, amount, currency, sourceAccountId, description } = this.form.getRawValue();
    this.submitted.emit({
      cardId,
      request: { amount: amount as number, currency, sourceAccountId, description },
    });
  }

  errorFor(name: 'amount' | 'currency' | 'sourceAccountId' | 'description'): string | null {
    const control = this.form.controls[name];
    if (!control.touched || control.valid) {
      return null;
    }
    if (control.hasError('required')) return 'Campo obligatorio';
    if (control.hasError('min')) return 'El monto debe ser mayor a 0';
    if (control.hasError('pattern')) return 'Formato invalido (ej. USD)';
    return 'Valor invalido';
  }
}
