import type { Card, CardMovement } from '../domain/card'

/** Contrato de integración (backend sin definir). La UI depende solo de esto. */
export interface CardsGateway {
  listCards(): Promise<Card[]>
  getMovements(cardId: string): Promise<CardMovement[]>
}
