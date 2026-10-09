export type EstadoPago = 'PENDIENTE' | 'PROCESADO' | 'RECHAZADO';

export const ESTADOS_PAGO: readonly EstadoPago[] = ['PENDIENTE', 'PROCESADO', 'RECHAZADO'];

export interface Pago {
  id: string;
  cuentaOrigenMask: string;
  beneficiario: string;
  monto: number;
  moneda: string;
  estado: EstadoPago;
  fechaPago: string;
}

export interface Pagina<T> {
  contenido: T[];
  page: number;
  size: number;
  totalElementos: number;
  totalPaginas: number;
}

export interface FiltroPagos {
  estado: EstadoPago | '';
  desde: string;
  hasta: string;
}
