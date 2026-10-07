const MASK = '••••';

function digitsOf(accountNumber: string): string {
  return accountNumber.replace(/[\s-]/g, '');
}

/** Ultimos 4 caracteres del numero (o vacio si tiene menos de 4). */
export function lastDigits(accountNumber: string): string {
  const clean = digitsOf(accountNumber);
  return clean.length >= 4 ? clean.slice(-4) : '';
}

/** Enmascara el numero de cuenta: nunca devuelve el numero completo. */
export function maskAccountNumber(accountNumber: string): string {
  const last = lastDigits(accountNumber);
  return last ? `${MASK} ${last}` : MASK;
}

/**
 * Formatea un monto en unidades menores con Intl.NumberFormat.
 * Lanza RangeError si el monto no es un entero seguro o la moneda es invalida.
 */
export function formatMoney(amountMinor: number, currency: string, locale = 'es'): string {
  if (!Number.isSafeInteger(amountMinor)) {
    throw new RangeError('El monto debe ser un entero en unidades menores.');
  }
  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency });
  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  return formatter.format(amountMinor / 10 ** fractionDigits);
}

/** Formatea una fecha ISO (YYYY-MM-DD) en UTC para evitar desfases de zona horaria. */
export function formatDate(isoDate: string, locale = 'es'): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Fecha invalida.');
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
}
