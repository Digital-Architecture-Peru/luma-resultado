export type TipoNotificacion = 'CONSUMO' | 'VENCIMIENTO' | 'BLOQUEO' | 'PAGO_RECIBIDO';

export interface Notificacion {
  id: number;
  tarjetaId: string;
  ultimos4: string;
  tipo: TipoNotificacion;
  mensaje: string;
  leida: boolean;
  creadaEn: string;
}

export interface Pagina<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export interface FiltroNotificaciones {
  leida?: boolean;
  page?: number;
  size?: number;
}

const ETIQUETAS: Record<TipoNotificacion, string> = {
  CONSUMO: 'Consumo',
  VENCIMIENTO: 'Vencimiento',
  BLOQUEO: 'Bloqueo',
  PAGO_RECIBIDO: 'Pago recibido',
};

export function etiquetaTipo(tipo: TipoNotificacion): string {
  return ETIQUETAS[tipo] ?? tipo;
}

export function claseTipo(tipo: TipoNotificacion): string {
  return `tipo-${tipo.toLowerCase().replace('_', '-')}`;
}

export function enmascararTarjeta(ultimos4: string): string {
  return `•••• ${ultimos4}`;
}
