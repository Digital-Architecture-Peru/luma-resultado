const formateadorMoneda = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "USD",
});

export function formatearMonto(valor: number): string {
  return formateadorMoneda.format(valor);
}

/** Porcentaje del límite ya utilizado, acotado a 0–100. */
export function porcentajeUtilizado(limite: number, disponible: number): number {
  if (limite <= 0) return 0;
  const usado = ((limite - disponible) / limite) * 100;
  return Math.min(100, Math.max(0, Math.round(usado)));
}
