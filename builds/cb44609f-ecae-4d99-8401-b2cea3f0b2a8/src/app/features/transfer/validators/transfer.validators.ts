import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Account, toCents } from '../../../core/accounts/model';

export function amountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return { required: true };
    }
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { amountInvalid: true };
    }
    return toCents(amount) === null ? { amountDecimals: true } : null;
  };
}

export const differentAccounts: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const from = group.get('fromId')?.value;
  const to = group.get('toId')?.value;
  return from && to && from === to ? { sameAccount: true } : null;
};

export function sufficientFunds(getAccounts: () => readonly Account[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const from = group.get('fromId')?.value;
    const amount = group.get('amount')?.value;
    if (!from || amount === null || amount === undefined || amount === '') {
      return null;
    }
    const cents = toCents(Number(amount));
    const account = getAccounts().find((a) => a.id === from);
    if (!account || cents === null || cents <= 0) {
      return null;
    }
    return cents > account.balanceCents ? { insufficientFunds: true } : null;
  };
}

export type TransferFormGroup = FormGroup<{
  fromId: FormControl<string>;
  toId: FormControl<string>;
  amount: FormControl<number | null>;
  concept: FormControl<string>;
}>;
