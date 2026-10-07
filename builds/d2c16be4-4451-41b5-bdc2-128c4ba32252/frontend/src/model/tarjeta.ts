export type EstadoTarjeta = "ACTIVA" | "BLOQUEADA" | "VENCIDA";
export type TipoTarjeta = "CREDITO" | "DEBITO";

export interface Tarjeta {
  id: string;
  numeroEnmascarado: string;
  titular: string;
  tipo: TipoTarjeta;
  estado: EstadoTarjeta;
  marca: string;
  limite: number;
  saldoDisponible: number;
  vencimiento: string;
}

export type FiltroEstado = EstadoTarjeta | "TODAS";

export const ESTADOS: readonly FiltroEstado[] = ["TODAS", "ACTIVA", "BLOQUEADA", "VENCIDA"];
