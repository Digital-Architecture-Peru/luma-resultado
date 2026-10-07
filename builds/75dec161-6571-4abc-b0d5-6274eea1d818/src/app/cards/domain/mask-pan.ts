/**
 * Enmascara un PAN mostrando solo los últimos 4 dígitos: `**** 1234`.
 * Entradas con menos de 4 dígitos devuelven solo el enmascarado.
 */
export function maskPan(pan: string | null | undefined): string {
  const digits = (pan ?? '').replace(/\D/g, '');
  if (digits.length < 4) {
    return '****';
  }
  return `**** ${digits.slice(-4)}`;
}
