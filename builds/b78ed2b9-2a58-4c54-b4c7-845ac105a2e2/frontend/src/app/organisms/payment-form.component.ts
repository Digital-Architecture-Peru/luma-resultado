import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AmountInputComponent } from '../atoms/amount-input.component';
import { ButtonComponent } from '../atoms/button.component';
import { FormFieldComponent } from '../molecules/form-field.component';

export interface PaymentFormValue {
  amount: number;
  sourceAccountAlias: string;
}

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, AmountInputComponent, ButtonComponent],
  template: `
    <form class="card" [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <h2>Pagar tarjeta</h2>
      <p class="muted">Moneda: {{ currency }}</p>
      <app-form-field label="Monto a pagar" inputId="pay-amount" [error]="amountError()">
        <app-amount-input inputId="pay-amount" [control]="form.controls.amount" />
      </app-form-field>
      <app-form-field label="Cuenta de origen (alias)" inputId="pay-source" [error]="aliasError()">
        <input id="pay-source" class="input" type="text" maxlength="40" formControlName="sourceAccountAlias" />
      </app-form-field>
      <app-button type="submit" [disabled]="busy">Pagar tarjeta</app-button>
    </form>
  `,
})
export class PaymentFormComponent {
  @Input() currency = 'USD';
  @Input() busy = false;
  @Output() submitted = new EventEmitter<PaymentFormValue>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    sourceAccountAlias: ['', [Validators.required, Validators.maxLength(40)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.submitted.emit({ amount: value.amount, sourceAccountAlias: value.sourceAccountAlias.trim() });
  }

  amountError(): string {
    const control = this.form.controls.amount;
    if (!control.touched) return '';
    if (control.hasError('pattern')) return 'Máximo 2 decimales.';
    if (control.invalid) return 'Ingresa un monto mayor a 0.';
    return '';
  }

  aliasError(): string {
    const control = this.form.controls.sourceAccountAlias;
    return control.touched && control.invalid ? 'Indica el alias de la cuenta de origen.' : '';
  }
}
