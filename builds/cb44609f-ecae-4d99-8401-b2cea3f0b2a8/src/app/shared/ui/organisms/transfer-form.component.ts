import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account, TransferDraft, toCents } from '../../../core/accounts/model';
import {
  TransferFormGroup,
  amountValidator,
  differentAccounts,
  sufficientFunds,
} from '../../../features/transfer/validators/transfer.validators';
import { UiButtonComponent } from '../atoms/button.component';
import { UiFormFieldComponent } from '../molecules/form-field.component';

@Component({
  selector: 'ui-transfer-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, UiButtonComponent, UiFormFieldComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <ui-form-field label="Cuenta de origen" forId="fromId" [error]="fromError()">
        <select id="fromId" formControlName="fromId" [attr.aria-invalid]="!!fromError()" aria-describedby="fromId-error">
          <option value="">Selecciona una cuenta</option>
          @for (account of accounts(); track account.id) {
            <option [value]="account.id">
              {{ account.alias }} {{ account.maskedNumber }} · {{ account.balanceCents / 100 | currency: account.currency }}
            </option>
          }
        </select>
      </ui-form-field>

      <ui-form-field label="Cuenta de destino" forId="toId" [error]="toError()">
        <select id="toId" formControlName="toId" [attr.aria-invalid]="!!toError()" aria-describedby="toId-error">
          <option value="">Selecciona una cuenta</option>
          @for (account of accounts(); track account.id) {
            <option [value]="account.id">{{ account.alias }} {{ account.maskedNumber }}</option>
          }
        </select>
      </ui-form-field>

      <ui-form-field label="Monto (PEN)" forId="amount" hint="Hasta 2 decimales" [error]="amountError()">
        <input
          id="amount"
          type="number"
          inputmode="decimal"
          step="0.01"
          min="0"
          formControlName="amount"
          [attr.aria-invalid]="!!amountError()"
          aria-describedby="amount-hint amount-error"
        />
      </ui-form-field>

      <ui-form-field label="Concepto (opcional)" forId="concept" [error]="conceptError()">
        <input id="concept" type="text" maxlength="60" formControlName="concept" autocomplete="off" />
      </ui-form-field>

      <div class="actions">
        <ui-button type="submit">Continuar</ui-button>
      </div>
    </form>
  `,
})
export class TransferFormComponent implements OnInit {
  readonly accounts = input.required<readonly Account[]>();
  readonly draft = input<TransferDraft | null>(null);
  readonly submitted = output<TransferDraft>();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly attempted = signal(false);

  readonly form: TransferFormGroup = this.fb.group(
    {
      fromId: this.fb.control('', Validators.required),
      toId: this.fb.control('', Validators.required),
      amount: this.fb.control<number | null>(null, amountValidator()),
      concept: this.fb.control('', Validators.maxLength(60)),
    },
    { validators: [differentAccounts, sufficientFunds(() => this.accounts())] },
  );

  ngOnInit(): void {
    const draft = this.draft();
    if (draft) {
      this.form.patchValue({
        fromId: draft.fromId,
        toId: draft.toId,
        amount: draft.amountCents / 100,
        concept: draft.concept,
      });
    }
  }

  submit(): void {
    this.attempted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    const amountCents = toCents(Number(value.amount));
    if (amountCents === null) {
      return;
    }
    this.submitted.emit({
      fromId: value.fromId,
      toId: value.toId,
      amountCents,
      concept: value.concept.trim(),
    });
  }

  fromError(): string | null {
    return this.show('fromId') && this.form.controls.fromId.hasError('required')
      ? 'Selecciona la cuenta de origen.'
      : null;
  }

  toError(): string | null {
    if (this.show('toId') && this.form.controls.toId.hasError('required')) {
      return 'Selecciona la cuenta de destino.';
    }
    return this.form.hasError('sameAccount') && this.show('toId')
      ? 'La cuenta de origen y destino deben ser distintas.'
      : null;
  }

  amountError(): string | null {
    const control = this.form.controls.amount;
    if (!this.show('amount')) {
      return null;
    }
    if (control.hasError('required')) {
      return 'Ingresa un monto.';
    }
    if (control.hasError('amountInvalid')) {
      return 'El monto debe ser mayor a cero.';
    }
    if (control.hasError('amountDecimals')) {
      return 'El monto admite hasta 2 decimales.';
    }
    return this.form.hasError('insufficientFunds') ? 'Saldo insuficiente en la cuenta de origen.' : null;
  }

  conceptError(): string | null {
    return this.form.controls.concept.hasError('maxlength') ? 'Máximo 60 caracteres.' : null;
  }

  private show(name: 'fromId' | 'toId' | 'amount'): boolean {
    return this.attempted() || this.form.controls[name].touched;
  }
}
