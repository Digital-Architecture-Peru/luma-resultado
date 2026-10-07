/** Movimiento de tarjeta. Importes negativos = consumos; positivos = pagos/abonos. */
export interface Movement {
  readonly id: string;
  readonly cardId: string;
  readonly date: string; // ISO yyyy-MM-dd
  readonly description: string;
  readonly amount: number;
  readonly currency: string;
}
