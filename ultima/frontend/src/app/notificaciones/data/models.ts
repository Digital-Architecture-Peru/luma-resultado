export type TipoNotificacion = 'COMPRA' | 'LIMITE' | 'VENCIMIENTO' | 'PAGO';
export type CanalNotificacion = 'WEB' | 'EMAIL' | 'SMS' | 'PUSH';

export interface Notificacion {
  id: string;
  tarjetaRef: string;
  ultimos4: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  monto: number | null;
  moneda: string | null;
  leida: boolean;
  creadaEn: string;
}

export interface PaginaNotificaciones {
  items: Notificacion[];
  total: number;
  page: number;
  size: number;
}

export interface Preferencia {
  tipo: TipoNotificacion;
  canal: CanalNotificacion;
  habilitada: boolean;
  umbralMonto: number | null;
}

export interface FiltroNotificaciones {
  leida?: boolean;
  page?: number;
  size?: number;
}

export type EstadoCarga = 'idle' | 'loading' | 'success' | 'error';
