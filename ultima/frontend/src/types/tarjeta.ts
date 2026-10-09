export type EstadoTarjeta = 'ACTIVA' | 'BLOQUEADA' | 'VENCIDA';

export interface Tarjeta {
  id: string;
  marca: string;
  tipo: 'CREDITO' | 'DEBITO';
  numeroEnmascarado: string;
  estado: EstadoTarjeta;
  limite: number;
  saldo: number;
  moneda: string;
  venceMesAnio: string;
}

export interface Pagina<T> {
  items: T[];
  pagina: number;
  tamano: number;
  total: number;
}

/** Puerto de acceso a datos; permite sustituirlo por un doble en pruebas. */
export interface TarjetasApi {
  listar(): Promise<Pagina<Tarjeta>>;
}
