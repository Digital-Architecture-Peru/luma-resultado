/** Presenta el monto sin convertirlo a number (evita pérdida de precisión). */
export function formatAmount(amount: string, currency: string): string {
  return `${amount} ${currency}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}
