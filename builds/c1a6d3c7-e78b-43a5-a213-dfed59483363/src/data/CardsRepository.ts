import type { Card } from '../domain/card'

/** Puerto de datos. Integración: Ninguna; hoy solo existe la implementación en memoria. */
export interface CardsRepository {
  list(): Promise<Card[]>
  getById(id: string): Promise<Card | null>
}
