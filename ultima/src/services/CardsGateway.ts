import type { Card, CardSummary, Movement } from '../domain/card'

/** Puerto de consulta de tarjetas. La integración real está sin definir. */
export interface CardsGateway {
  listCards(): Promise<CardSummary[]>
  /** Devuelve null si la tarjeta no existe. */
  getCard(id: string): Promise<Card | null>
  getMovements(id: string): Promise<Movement[]>
}
