export type TipoCuenta = 'AHORRO' | 'CORRIENTE';
export type EstadoCuenta = 'ACTIVA' | 'BLOQUEADA' | 'CERRADA';

export interface CuentaResumen {
  id: string;
  numeroEnmascarado: string;
  tipo: TipoCuenta;
  moneda: string;
  saldoDisponible: number;
  estado: EstadoCuenta;
}
