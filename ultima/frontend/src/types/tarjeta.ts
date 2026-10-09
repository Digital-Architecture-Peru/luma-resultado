export type TipoTarjeta = "CREDITO" | "DEBITO";
export type EstadoTarjeta = "ACTIVA" | "BLOQUEADA" | "VENCIDA";

/** Montos como texto decimal (p. ej. "3250.75") para no perder precisión. */
export interface TarjetaResumen {
  id: string;
  ultimos4: string;
  marca: string;
  tipo: TipoTarjeta;
  estado: EstadoTarjeta;
  moneda: string;
  saldoDisponible: string;
  vencimiento: string;
}

export interface TarjetaDetalle extends Omit<TarjetaResumen, never> {
  limiteCredito: string | null;
}
