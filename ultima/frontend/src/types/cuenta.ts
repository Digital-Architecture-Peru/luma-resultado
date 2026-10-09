export type TipoCuenta = 'AHORROS' | 'CORRIENTE';
export type EstadoCuenta = 'ACTIVA' | 'BLOQUEADA';

export interface Cuenta {
  id: string;
  numeroEnmascarado: string;
  tipo: TipoCuenta;
  moneda: string;
  saldo: number;
  estado: EstadoCuenta;
  actualizadoEn: string;
}
