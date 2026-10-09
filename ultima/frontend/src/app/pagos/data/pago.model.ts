export type EstadoPago = 'PENDIENTE' | 'PROCESADO' | 'RECHAZADO' | 'ANULADO';

export const ESTADOS: readonly EstadoPago[] = ['PENDIENTE', 'PROCESADO', 'RECHAZADO', 'ANULADO'];

export interface Pago {
  id: number;
  cuentaEnmascarada: string;
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
  totalPaginas: number;
}

export interface FiltroPagos {
  cuentaId: string;
  desde?: string;
  hasta?: string;
  estado?: EstadoPago | '';
  page: number;
  size: number;
}
