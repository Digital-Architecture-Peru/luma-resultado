const MONEY_PATTERN = /^\d{1,13}(\.\d{1,2})?$/;

/** Devuelve un mensaje de error o null si el monto es válido. `maxBalance` es opcional. */
export function validateAmount(raw: string, maxBalance?: string): string | null {
  const value = raw.trim();
  if (value === '') return 'Ingrese el monto a pagar';
  if (!MONEY_PATTERN.test(value)) return 'Use un número con hasta 2 decimales, por ejemplo 150.00';
  const amount = Number(value);
  if (amount <= 0) return 'El monto debe ser mayor a cero';
  if (maxBalance !== undefined && amount > Number(maxBalance)) {
    return 'El monto excede la deuda de la tarjeta';
  }
  return null;
}

const formatter = new Intl.NumberFormat('es', { style: 'currency', currency: 'USD' });

export function formatMoney(value: string): string {
  return formatter.format(Number(value));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es', { year: 'numeric', month: 'short', day: '2-digit' });
}
