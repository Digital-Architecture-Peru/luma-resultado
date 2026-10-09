export type EstadoPago = 'COMPLETADO' | 'PENDIENTE' | 'RECHAZADO';
export type FiltroEstado = EstadoPago | 'TODOS';
export type Moneda = 'PEN' | 'USD';

export interface Pago {
  readonly id: string;
  readonly fecha: string; // ISO yyyy-mm-dd
  readonly beneficiario: string;
  readonly concepto: string;
  readonly monto: number;
  readonly moneda: Moneda;
  readonly estado: EstadoPago;
  readonly referencia: string;
}

export interface FiltroPagos {
  readonly texto: string;
  readonly estado: FiltroEstado;
}

export const ESTADOS_PAGO: readonly EstadoPago[] = ['COMPLETADO', 'PENDIENTE', 'RECHAZADO'];

export const ETIQUETA_ESTADO: Record<EstadoPago, string> = {
  COMPLETADO: 'Completado',
  PENDIENTE: 'Pendiente',
  RECHAZADO: 'Rechazado',
};

export function esFiltroEstado(valor: string): valor is FiltroEstado {
  return valor === 'TODOS' || (ESTADOS_PAGO as readonly string[]).includes(valor);
}
