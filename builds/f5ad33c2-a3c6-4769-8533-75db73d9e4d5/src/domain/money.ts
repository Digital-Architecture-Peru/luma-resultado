export function formatMoney(amount: number, currency: string, locale = 'es'): string {
  if (!Number.isFinite(amount)) return '—'
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
  } catch {
    // Código de moneda o locale inválido: formato numérico simple
    return `${amount.toFixed(2)} ${currency}`
  }
}

export function formatDate(iso: string, locale = 'es'): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(d)
}
