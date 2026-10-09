import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AmountInputComponent, amountValidator } from '../atoms/amount-input.component';
import { AppButtonComponent } from '../atoms/app-button.component';
import { Account, TransferRequest } from '../core/models';
import { AccountSelectComponent } from '../molecules/account-select.component';
import { FormFieldComponent } from '../molecules/form-field.component';

type FieldName = 'source' | 'target' | 'amount';

@Component({
  selector: 'app-transfer-form',
  standalone: true,
  imports: [ReactiveFormsModule, AmountInputComponent, AppButtonComponent, AccountSelectComponent, FormFieldComponent],
  template: `<form class="card" [formGroup]="form" (ngSubmit)="submit()" novalidate>
    <app-form-field label="Cuenta origen" forId="source" [error]="error('source')">
      <app-account-select selectId="source" [control]="form.controls.source" [accounts]="accounts" />
    </app-form-field>
    <app-form-field label="Cuenta destino" forId="target" [error]="error('target')">
      <app-account-select selectId="target" [control]="form.controls.target" [accounts]="accounts" />
    </app-form-field>
    <app-form-field label="Monto" forId="amount" [error]="error('amount')">
      <app-amount-input inputId="amount" [control]="form.controls.amount" />
    </app-form-field>
    <app-form-field label="Descripción (opcional)" forId="description">
      <input class="input" id="description" type="text" maxlength="140" [formControl]="form.controls.description" />
    </app-form-field>
    @if (formError) {
      <p class="field-error" role="alert">{{ formError }}</p>
    }
    <app-button type="submit" [disabled]="busy">{{ busy ? 'Procesando…' : 'Transferir' }}</app-button>
  </form>`,
})
export class TransferFormComponent {
  @Input() accounts: Account[] = [];
  @Input() busy = false;
  @Output() submitted = new EventEmitter<TransferRequest>();

  readonly form = new FormGroup({
    source: new FormControl<number | null>(null, [Validators.required]),
    target: new FormControl<number | null>(null, [Validators.required]),
    amount: new FormControl('', { nonNullable: true, validators: [amountValidator] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(140)] }),
  });

  formError = '';

  submit(): void {
    this.form.markAllAsTouched();
    this.formError = this.crossFieldError();
    const { source, target, amount, description } = this.form.getRawValue();
    const sourceAccount = this.find(source);
    if (this.form.invalid || this.formError !== '' || sourceAccount === undefined || target === null) {
      return;
    }
    this.submitted.emit({
      sourceAccountId: sourceAccount.id,
      targetAccountId: target,
      amount: Number(amount),
      currency: sourceAccount.currency,
      description: description.trim(),
    });
  }

  error(field: FieldName): string | null {
    const control = this.form.controls[field];
    if (!control.touched || !control.errors) {
      return null;
    }
    if (control.errors['required']) {
      return field === 'amount' ? 'Ingrese un monto.' : 'Seleccione una cuenta.';
    }
    if (control.errors['format']) {
      return 'Use solo números con hasta 2 decimales.';
    }
    if (control.errors['positive']) {
      return 'El monto debe ser mayor que cero.';
    }
    return 'Valor no válido.';
  }

  private crossFieldError(): string {
    const { source, target } = this.form.getRawValue();
    if (source === null || target === null) {
      return '';
    }
    if (source === target) {
      return 'La cuenta origen y destino deben ser distintas.';
    }
    const from = this.find(source);
    const to = this.find(target);
    return from && to && from.currency !== to.currency ? 'Las cuentas deben tener la misma moneda.' : '';
  }

  private find(id: number | null): Account | undefined {
    return id === null ? undefined : this.accounts.find((a) => a.id === id);
  }
}
