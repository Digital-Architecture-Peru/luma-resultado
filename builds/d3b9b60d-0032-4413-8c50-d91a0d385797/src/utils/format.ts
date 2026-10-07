export function formatMoney(amount: number, currency: string, locale?: string): string {
  const loc = locale ?? import.meta.env.VITE_LOCALE ?? 'es'
  try {
    return new Intl.NumberFormat(loc || 'es', { style: 'currency', currency }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}
