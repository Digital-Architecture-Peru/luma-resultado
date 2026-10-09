import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const ACCOUNT_PATTERN = /^\d{10,20}$/;

export function amountValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value as string | null;
    if (raw === null || raw === undefined || raw === '') {
      return null; // 'required' se valida aparte
    }
    const value = Number(raw);
    if (Number.isNaN(value)) {
      return { amountInvalid: 'Ingrese un monto numérico.' };
    }
    if (value <= 0) {
      return { amountPositive: 'El monto debe ser mayor que cero.' };
    }
    if (value > max) {
      return { amountMax: `El monto no puede superar ${max}.` };
    }
    if (Math.round(value * 100) / 100 !== value) {
      return { amountScale: 'Use máximo dos decimales.' };
    }
    return null;
  };
}

/** Validador de grupo: la cuenta destino debe diferir de la de origen. */
export const differentAccountsValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const source = group.get('sourceAccountId')?.value as string | undefined;
  const target = group.get('beneficiaryAccount')?.value as string | undefined;
  return source && target && source === target
    ? { sameAccount: 'La cuenta destino debe ser distinta de la de origen.' }
    : null;
};
