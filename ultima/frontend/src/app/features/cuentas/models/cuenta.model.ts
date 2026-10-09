export type EstadoCuenta = 'ACTIVA' | 'BLOQUEADA' | 'CERRADA';

export interface Cuenta {
  id: number;
  numeroEnmascarado: string;
  tipo: string;
  moneda: string;
  saldoDisponible: number;
  estado: EstadoCuenta;
  fechaApertura: string;
}
