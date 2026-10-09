/** Los importes se manejan en centavos enteros para evitar errores de coma flotante. */
export type Cents = number;

const AMOUNT_PATTERN = /^\d{1,9}(\.\d{1,2})?$/;

/** Convierte "25.50" en 2550; devuelve null si el texto no es un importe válido. */
export function parseAmountToCents(text: string): Cents | null {
  const normalized = text.trim().replace(',', '.');
  if (!AMOUNT_PATTERN.test(normalized)) {
    return null;
  }
  return Math.round(Number(normalized) * 100);
}

export function formatCents(cents: Cents): string {
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(cents / 100);
}
