const DEFAULT_LOCALE = 'es-PE'
const DEFAULT_CURRENCY = 'PEN'

export function formatMoney(
  value: number,
  locale: string = DEFAULT_LOCALE,
  currency: string = DEFAULT_CURRENCY
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}

/** Formatea una fecha ISO yyyy-mm-dd en UTC para evitar desfases de zona horaria. */
export function formatDate(iso: string, locale: string = DEFAULT_LOCALE): string {
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(date)
}

export function useFormatters() {
  const locale = import.meta.env.VITE_LOCALE || DEFAULT_LOCALE
  const currency = import.meta.env.VITE_CURRENCY || DEFAULT_CURRENCY
  return {
    locale,
    currency,
    money: (v: number) => formatMoney(v, locale, currency),
    date: (iso: string) => formatDate(iso, locale)
  }
}
