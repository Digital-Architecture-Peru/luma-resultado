import { Pipe, PipeTransform } from '@angular/core';

/** Enmascara un número de cuenta dejando solo los últimos 4 dígitos. Idempotente. */
export function maskAccountNumber(value: string | null | undefined): string {
  const digits = (value ?? '').replace(/\D/g, '');
  if (digits.length < 4) {
    return '••••';
  }
  return `•••• ${digits.slice(-4)}`;
}

@Pipe({ name: 'maskAccount', standalone: true })
export class MaskAccountPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return maskAccountNumber(value);
  }
}
