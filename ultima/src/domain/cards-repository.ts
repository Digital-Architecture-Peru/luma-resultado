import type { Card } from './card'
import type { Movement, MovementFilter } from './movement'

/** Puerto de acceso a datos de tarjetas (integracion sin definir). */
export interface CardsRepository {
  listCards(): Promise<Card[]>
  listMovements(cardId: string, filter?: MovementFilter): Promise<Movement[]>
}
