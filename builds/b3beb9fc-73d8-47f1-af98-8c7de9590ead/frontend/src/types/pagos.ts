export type EstadoPago = 'PENDIENTE' | 'PROCESADO' | 'RECHAZADO';

export const ESTADOS: readonly EstadoPago[] = ['PENDIENTE', 'PROCESADO', 'RECHAZADO'];

export interface Pago {
  id: number;
  cuenta: string;
  beneficiario: string;
  concepto: string;
  monto: number;
  moneda: string;
  estado: EstadoPago;
  fechaPago: string;
}

export interface Pagina<T> {
  contenido: T[];
  page: number;
  size: number;
  total: number;
}

export interface FiltrosPagos {
  desde: string;
  hasta: string;
  estado: EstadoPago | '';
}

export type BuscarPagos = (filtros: FiltrosPagos, page: number, size: number) => Promise<Pagina<Pago>>;
