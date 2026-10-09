export const ESTADOS_PAGO = ["PENDIENTE", "PROCESADO", "RECHAZADO", "REVERSADO"] as const;

export type EstadoPago = (typeof ESTADOS_PAGO)[number];

export interface Pago {
  id: string;
  referencia: string;
  beneficiario: string;
  cuentaDestino: string;
  monto: number;
  moneda: string;
  estado: EstadoPago;
  fechaPago: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface FiltroPagos {
  desde?: string;
  hasta?: string;
  estado?: EstadoPago;
  page: number;
  pageSize: number;
}
