import type { Card } from './card'

/** Puerto de lectura de tarjetas (solo consulta). */
export interface CardRepository {
  listCards(): Promise<Card[]>
}
