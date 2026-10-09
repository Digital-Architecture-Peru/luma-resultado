import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AppButtonComponent } from '../atoms/app-button.component';
import { amountValidator } from '../atoms/amount.validator';
import { Account, SubmittedTransfer } from '../core/models';
import { newIdempotencyKey } from '../core/idempotency';
import { AccountSelectorComponent } from '../molecules/account-selector.component';
import { AmountFieldComponent } from '../molecules/amount-field.component';

function differentAccounts(group: AbstractControl): ValidationErrors | null {
  const source = group.get('source')?.value;
  const target = group.get('target')?.value;
  return source !== null && source === target ? { sameAccount: true } : null;
}

@Component({
  selector: 'app-transfer-form',
  standalone: true,
  imports: [ReactiveFormsModule, AppButtonComponent, AccountSelectorComponent, AmountFieldComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="card">
      <app-account-selector fieldId="source" label="Cuenta origen" [control]="form.controls.source" [accounts]="accounts" />
      <app-account-selector
        fieldId="target"
        label="Cuenta destino"
        [control]="form.controls.target"
        [accounts]="accounts"
        [extraError]="sameAccountError"
      />
      <app-amount-field fieldId="amount" label="Monto" [control]="form.controls.amount" />
      <div class="field">
        <label for="description">Descripción (opcional)</label>
        <input id="description" class="input" maxlength="140" formControlName="description" />
      </div>
      <app-button type="submit" [disabled]="busy">Transferir</app-button>
    </form>
  `,
})
export class TransferFormComponent {
  @Input() accounts: Account[] = [];
  @Input() busy = false;
  @Output() submitted = new EventEmitter<SubmittedTransfer>();

  readonly form = new FormGroup(
    {
      source: new FormControl<number | null>(null, Validators.required),
      target: new FormControl<number | null>(null, Validators.required),
      amount: new FormControl('', { nonNullable: true, validators: [Validators.required, amountValidator] }),
      description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(140)] }),
    },
    { validators: differentAccounts },
  );

  private idempotencyKey = newIdempotencyKey();

  constructor() {
    // Datos distintos = intento distinto = clave nueva; mismos datos reintentados reutilizan la clave.
    this.form.valueChanges.subscribe(() => (this.idempotencyKey = newIdempotencyKey()));
  }

  get sameAccountError(): string | null {
    return this.form.hasError('sameAccount') && this.form.controls.target.touched
      ? 'La cuenta destino debe ser distinta del origen'
      : null;
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    const source = this.accounts.find((a) => a.id === value.source);
    if (!source || value.target === null) {
      return;
    }
    this.submitted.emit({
      request: {
        sourceAccountId: source.id,
        targetAccountId: value.target,
        amount: value.amount.trim(),
        currency: source.currency,
        description: value.description.trim(),
      },
      idempotencyKey: this.idempotencyKey,
    });
  }

  reset(): void {
    this.form.reset({ source: null, target: null, amount: '', description: '' });
    this.idempotencyKey = newIdempotencyKey();
  }
}
