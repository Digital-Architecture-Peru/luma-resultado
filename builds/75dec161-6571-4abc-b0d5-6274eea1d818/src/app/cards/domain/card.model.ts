export type CardType = 'CREDITO' | 'DEBITO';
export type CardStatus = 'ACTIVA' | 'BLOQUEADA';

/** Propuesta de modelo (H5): validar con el backend. Datos ficticios. */
export interface Card {
  id: string;
  alias: string;
  brand: string;
  type: CardType;
  status: CardStatus;
  /** PAN ficticio; nunca se muestra completo (ver maskPan). */
  pan: string;
  holder: string;
  creditLine: number;
  balance: number;
  available: number;
  /** Fecha ISO yyyy-mm-dd. */
  cutOffDate: string;
}
