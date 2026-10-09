import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

const AMOUNT_PATTERN = /^\d{1,17}(\.\d{1,2})?$/;

/** Monto positivo con hasta 2 decimales (coincide con NUMERIC(19,2) del backend). */
export const amountValidator: ValidatorFn = (control) => {
  const raw = String(control.value ?? '').trim();
  if (raw === '') {
    return { required: true };
  }
  if (!AMOUNT_PATTERN.test(raw)) {
    return { format: true };
  }
  return Number(raw) > 0 ? null : { positive: true };
};

@Component({
  selector: 'app-amount-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `<input
    class="input"
    type="text"
    inputmode="decimal"
    autocomplete="off"
    placeholder="0.00"
    [id]="inputId"
    [formControl]="control"
    [attr.aria-invalid]="control.invalid && control.touched" />`,
})
export class AmountInputComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input() inputId = 'amount';
}
