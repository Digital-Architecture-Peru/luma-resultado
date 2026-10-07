import type { Card } from './card'

/** Enmascara el número: como máximo 4 dígitos visibles. */
export function maskCard(last4: string): string {
  const digits = (last4 ?? '').replace(/\D/g, '').slice(-4)
  const visible = digits.padStart(4, '•')
  return `•••• •••• •••• ${visible}`
}

export function formatMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export function formatDate(iso: string | undefined, locale: string): string {
  if (!iso) return '—'
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(d)
}

/** Porcentaje de línea utilizada (0-100) o null si no aplica. */
export function utilization(card: Card): number | null {
  if (card.type !== 'credit' || !card.creditLimit || card.creditLimit <= 0) return null
  const pct = ((card.creditLimit - card.available) / card.creditLimit) * 100
  return Math.min(100, Math.max(0, Math.round(pct)))
}
