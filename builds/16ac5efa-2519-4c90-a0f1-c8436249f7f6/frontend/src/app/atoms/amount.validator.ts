import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Hasta 13 enteros y 2 decimales, coherente con NUMERIC(19,2) del backend. */
export const AMOUNT_PATTERN = /^\d{1,13}(\.\d{1,2})?$/;

export function amountValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '').trim();
  if (value === '') {
    return null; // la obligatoriedad la valida Validators.required
  }
  if (!AMOUNT_PATTERN.test(value)) {
    return { amountFormat: true };
  }
  return Number(value) > 0 ? null : { amountPositive: true };
}
