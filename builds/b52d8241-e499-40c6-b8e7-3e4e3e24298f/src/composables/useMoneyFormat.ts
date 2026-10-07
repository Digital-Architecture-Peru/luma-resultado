export function getLocale(): string {
  return import.meta.env?.VITE_LOCALE || 'es'
}

export function formatMoney(amount: number, currency: string, locale: string = getLocale()): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
  } catch {
    // Moneda o locale invalido: degradar a numero simple con codigo.
    return `${amount.toFixed(2)} ${currency}`
  }
}

export function formatDate(iso: string, locale: string = getLocale()): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(d)
}
