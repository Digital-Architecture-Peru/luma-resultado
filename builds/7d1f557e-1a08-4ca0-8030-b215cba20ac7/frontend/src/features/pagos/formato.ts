import type { EstadoPago } from '../../api/pagosClient';

export const ETIQUETA_ESTADO: Record<EstadoPago, string> = {
  PENDIENTE: 'Pendiente',
  APLICADO: 'Aplicado',
  RECHAZADO: 'Rechazado'
};

/** Solo para mostrar: el valor original permanece como texto. */
export function formatearMonto(monto: string, moneda: string): string {
  const numero = Number(monto);
  if (Number.isNaN(numero)) return `${monto} ${moneda}`;
  try {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: moneda }).format(numero);
  } catch {
    return `${monto} ${moneda}`;
  }
}

export function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return iso;
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(fecha);
}

/** Convierte 'yyyy-mm-dd' al inicio del día en UTC. */
export function inicioDelDia(fecha: string): string | undefined {
  return fecha ? `${fecha}T00:00:00Z` : undefined;
}

/** Convierte 'yyyy-mm-dd' al fin del día en UTC. */
export function finDelDia(fecha: string): string | undefined {
  return fecha ? `${fecha}T23:59:59Z` : undefined;
}
