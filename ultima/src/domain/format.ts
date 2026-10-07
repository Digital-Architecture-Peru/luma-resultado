import type { Currency } from './types';

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  }).format(amount);
}
