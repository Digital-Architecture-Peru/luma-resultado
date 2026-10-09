import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ButtonComponent } from '../atoms/button.component';
import { PaymentRequest } from '../core/models';
import { ACCOUNT_PATTERN, amountValidator, differentAccountsValidator } from '../core/validators';
import { FormFieldComponent } from '../molecules/form-field.component';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, ButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <app-form-field label="Cuenta de origen" fieldId="source" [control]="form.controls.sourceAccountId">
        <select id="source" formControlName="sourceAccountId">
          <option value="">Seleccione una cuenta</option>
          @for (account of accounts; track account) {
            <option [value]="account">{{ account }}</option>
          }
        </select>
      </app-form-field>

      <app-form-field label="Cuenta destino" fieldId="beneficiary" [control]="form.controls.beneficiaryAccount"
        hint="10 a 20 dígitos" patternMessage="La cuenta debe tener entre 10 y 20 dígitos.">
        <input id="beneficiary" formControlName="beneficiaryAccount" inputmode="numeric" autocomplete="off">
      </app-form-field>

      <app-form-field label="Monto (PEN)" fieldId="amount" [control]="form.controls.amount">
        <input id="amount" formControlName="amount" inputmode="decimal" autocomplete="off">
      </app-form-field>

      <app-form-field label="Concepto" fieldId="concept" [control]="form.controls.concept">
        <input id="concept" formControlName="concept" maxlength="140">
      </app-form-field>

      @if (form.errors?.['sameAccount'] && form.controls.beneficiaryAccount.touched) {
        <p class="error" role="alert">{{ form.errors?.['sameAccount'] }}</p>
      }

      <div class="actions">
        <app-button type="submit" label="Continuar"></app-button>
      </div>
    </form>`
})
export class PaymentFormComponent {
  @Input() accounts: string[] = [];
  @Output() submitted = new EventEmitter<PaymentRequest>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group(
    {
      sourceAccountId: ['', [Validators.required]],
      beneficiaryAccount: ['', [Validators.required, Validators.pattern(ACCOUNT_PATTERN)]],
      amount: ['', [Validators.required, amountValidator(environment.maxAmount)]],
      concept: ['', [Validators.maxLength(140)]]
    },
    { validators: differentAccountsValidator }
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.submitted.emit({
      sourceAccountId: value.sourceAccountId,
      beneficiaryAccount: value.beneficiaryAccount,
      amount: Number(value.amount),
      currency: environment.currency,
      concept: value.concept.trim()
    });
  }
}
