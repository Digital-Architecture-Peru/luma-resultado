export type EstadoPago = 'PENDIENTE' | 'CONFIRMADO' | 'RECHAZADO';

export interface PagoRequest {
  cuentaOrigen: string;
  cuentaDestino: string;
  monto: number;
  moneda: string;
}

export interface Pago extends PagoRequest {
  id: string;
  estado: EstadoPago;
  creadoEn: string;
}

export const MONEDAS: readonly string[] = ['USD', 'EUR', 'PEN'];
export const PATRON_CUENTA = /^[A-Z0-9-]{8,34}$/;
