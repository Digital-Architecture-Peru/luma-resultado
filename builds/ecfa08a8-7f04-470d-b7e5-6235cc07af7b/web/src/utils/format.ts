export function formatMonto(monto: number, moneda: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: moneda }).format(monto);
}

export function formatFecha(iso: string, locale: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(
    fecha,
  );
}
