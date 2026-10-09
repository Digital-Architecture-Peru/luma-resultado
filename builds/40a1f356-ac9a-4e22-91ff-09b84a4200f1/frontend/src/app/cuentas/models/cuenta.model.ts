export type TipoCuenta = 'AHORRO' | 'CORRIENTE';
export type EstadoCuenta = 'ACTIVA' | 'BLOQUEADA' | 'CERRADA';

export interface Cuenta {
  id: string;
  numeroEnmascarado: string;
  tipo: TipoCuenta;
  moneda: string;
  saldo: number;
  estado: EstadoCuenta;
  fechaApertura: string;
}

export interface PaginaCuentas {
  contenido: Cuenta[];
  pagina: number;
  tamanio: number;
  totalElementos: number;
  totalPaginas: number;
}
