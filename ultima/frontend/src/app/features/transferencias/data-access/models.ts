export interface Cuenta {
  id: string;
  numeroEnmascarado: string;
  moneda: string;
  saldo: number;
}

export interface TransferenciaSolicitud {
  origenId: string;
  destinoId: string;
  monto: number;
  moneda: string;
  concepto: string;
}

export interface Comprobante {
  id: string;
  origenId: string;
  destinoId: string;
  monto: number;
  moneda: string;
  concepto: string | null;
  estado: string;
  creadoEn: string;
  saldoOrigen: number;
}
