const LOCALE = "es-PE";

/** Formatea un decimal en texto (p. ej. "15230.50") como moneda. */
export function formatMoney(value: string, currency: string): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return value;
  }
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency }).format(amount);
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium" }).format(date);
}
