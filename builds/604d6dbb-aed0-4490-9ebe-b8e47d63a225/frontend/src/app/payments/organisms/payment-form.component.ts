import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AmountInputComponent } from '../atoms/amount-input.component';
import { AppButtonComponent } from '../atoms/app-button.component';
import { AccountSelectorComponent } from '../molecules/account-selector.component';
import { FormFieldComponent } from '../molecules/form-field.component';
import { Account, PaymentSubmission } from '../models/payment.models';
import { newIdempotencyKey } from '../services/idempotency-key';

const ERRORS: Record<string, string> = {
  required: 'Este campo es obligatorio',
  min: 'El monto debe ser mayor a 0',
  pattern: 'Use 6 a 34 caracteres alfanuméricos o guiones',
  maxlength: 'Máximo 140 caracteres',
};

// Se valida el valor tal como se enviará (recortado): los espacios en los extremos se toleran
// porque submit() aplica trim() antes de emitir.
const TARGET_ACCOUNT_PATTERN = /^\s*[A-Za-z0-9-]{6,34}\s*$/;

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [ReactiveFormsModule, AmountInputComponent, AppButtonComponent, AccountSelectorComponent, FormFieldComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <app-account-selector
        [accounts]="accounts"
        [control]="form.controls.sourceAccountId"
        [error]="errorOf('sourceAccountId')"
      />
      <app-form-field label="Cuenta destino" inputId="target" [error]="errorOf('targetAccount')">
        <input id="target" formControlName="targetAccount" autocomplete="off" />
      </app-form-field>
      <app-form-field [label]="'Monto' + (currency ? ' (' + currency + ')' : '')" inputId="amount" [error]="errorOf('amount')">
        <app-amount-input inputId="amount" formControlName="amount" />
      </app-form-field>
      <app-form-field label="Referencia (opcional)" inputId="reference" [error]="errorOf('reference')">
        <input id="reference" formControlName="reference" autocomplete="off" />
      </app-form-field>
      <app-button type="submit" label="Pagar" [disabled]="busy" />
    </form>
  `,
})
export class PaymentFormComponent {
  @Input() accounts: Account[] = [];
  @Input() busy = false;
  @Output() submitPayment = new EventEmitter<PaymentSubmission>();

  // Misma clave en los reintentos de este formulario: evita el doble cargo.
  private readonly idempotencyKey = newIdempotencyKey();

  readonly form = new FormGroup({
    sourceAccountId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    targetAccount: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(TARGET_ACCOUNT_PATTERN)],
    }),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    reference: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(140)] }),
  });

  get currency(): string {
    const id = this.form.controls.sourceAccountId.value;
    return this.accounts.find((a) => a.id === id)?.currency ?? '';
  }

  errorOf(name: keyof PaymentFormComponent['form']['controls']): string | null {
    const control = this.form.controls[name];
    if (!control.touched || !control.errors) {
      return null;
    }
    const code = Object.keys(control.errors)[0];
    return ERRORS[code] ?? 'Valor inválido';
  }

  submit(): void {
    if (this.busy) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.submitPayment.emit({
      idempotencyKey: this.idempotencyKey,
      request: {
        sourceAccountId: value.sourceAccountId,
        targetAccount: value.targetAccount.trim(),
        amount: Number(value.amount),
        currency: this.currency,
        reference: value.reference.trim(),
      },
    });
  }
}
