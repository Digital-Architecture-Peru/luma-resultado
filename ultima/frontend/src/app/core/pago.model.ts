export type EstadoPago = 'PENDIENTE' | 'PROCESADO' | 'RECHAZADO' | 'ANULADO';

export const ESTADOS_PAGO: readonly EstadoPago[] = ['PENDIENTE', 'PROCESADO', 'RECHAZADO', 'ANULADO'];

export interface Pago {
  id: string;
  cuentaEnmascarada: string;
  referencia: string;
  beneficiario: string;
  monto: number;
  moneda: string;
  estado: EstadoPago;
  fechaPago: string;
  canal: string;
}

export interface PaginaPagos {
  items: Pago[];
  page: number;
  size: number;
  total: number;
}

/** Filtros de la UI: fechas en formato yyyy-MM-dd (hora local del usuario, enviadas como UTC). */
export interface FiltroPagos {
  desde?: string;
  hasta?: string;
  estado?: EstadoPago | '';
  page: number;
  size: number;
}
