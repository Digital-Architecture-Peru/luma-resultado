import type { CardDetail, CardSummary } from '../domain/card'

/** Puerto de consulta (solo lectura). La integración real está sin definir. */
export interface CardQueryPort {
  listCards(): Promise<CardSummary[]>
  getCard(id: string): Promise<CardDetail>
}
