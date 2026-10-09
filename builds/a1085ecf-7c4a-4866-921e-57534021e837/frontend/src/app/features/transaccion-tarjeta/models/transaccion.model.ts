export type EstadoTransaccion = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';

export interface Tarjeta {
  id: number;
  ultimos4: string;
  tipo: string;
  estado: string;
}

export interface SolicitudTransaccion {
  monto: number;
  moneda: string;
}

export interface Transaccion {
  id: string;
  tarjetaId: number;
  monto: number;
  moneda: string;
  estado: EstadoTransaccion;
  creadoEn: string;
}

export interface ResultadoTransaccion {
  transaccion: Transaccion;
  repetida: boolean;
}
