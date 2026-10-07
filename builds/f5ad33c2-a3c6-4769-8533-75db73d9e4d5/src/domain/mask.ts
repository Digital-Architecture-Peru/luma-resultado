/**
 * Enmascara un número de tarjeta mostrando como máximo los últimos 4 dígitos.
 * Acepta un PAN completo o solo los últimos dígitos.
 */
export function maskPan(input: string | null | undefined): string {
  const digits = (input ?? '').replace(/\D/g, '')
  if (digits.length === 0) return '•••• ••••'
  return `•••• ${digits.slice(-4)}`
}
