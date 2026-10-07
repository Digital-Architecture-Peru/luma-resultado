const HIDDEN = '•••• •••• •••• '

/** Devuelve el PAN enmascarado mostrando como máximo 4 dígitos. */
export function maskPan(last4: string): string {
  const digits = (last4 ?? '').replace(/\D/g, '')
  if (digits.length === 0) return HIDDEN + '••••'
  return HIDDEN + digits.slice(-4)
}

export function formatMoney(
  amount: number,
  currency: string = import.meta.env.VITE_CURRENCY ?? 'PEN',
  locale: string = import.meta.env.VITE_LOCALE ?? 'es-PE'
): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
  } catch {
    return amount.toFixed(2)
  }
}

export function formatDate(iso: string, locale: string = import.meta.env.VITE_LOCALE ?? 'es-PE'): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(d)
}
