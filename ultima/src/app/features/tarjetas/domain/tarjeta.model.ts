export type EstadoTarjeta = 'ACTIVA' | 'BLOQUEADA' | 'VENCIDA';
export type TipoTarjeta = 'CREDITO' | 'DEBITO';

export interface Tarjeta {
  readonly id: string;
  readonly alias: string;
  /** Número ficticio; solo se muestra enmascarado mediante maskPan. */
  readonly numero: string;
  readonly tipo: TipoTarjeta;
  readonly estado: EstadoTarjeta;
  readonly saldo: number;
  readonly limite: number;
  readonly moneda: string;
}
