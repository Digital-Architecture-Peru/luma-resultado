export function formatearMonto(monto: number, moneda: string): string {
  return new Intl.NumberFormat('es', { style: 'currency', currency: moneda }).format(monto);
}
