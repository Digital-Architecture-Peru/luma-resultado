export type TipoEvento = 'ABONO' | 'CARGO' | 'SALDO_BAJO';
export type Canal = 'EMAIL' | 'SMS' | 'APP';
export type EstadoRemoto = 'idle' | 'loading' | 'success' | 'error';

export interface Notificacion {
  id: string;
  cuenta: string;
  tipo: TipoEvento;
  mensaje: string;
  monto: number | null;
  leida: boolean;
  creadaEn: string;
}

export interface Pagina<T> {
  contenido: T[];
  page: number;
  size: number;
  total: number;
}

export interface Preferencia {
  tipo: TipoEvento;
  canal: Canal;
  activo: boolean;
  umbralMonto: number | null;
}

export interface OpcionesListado {
  leida?: boolean;
  page?: number;
  size?: number;
}
