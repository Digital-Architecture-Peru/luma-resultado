import type { Card, CardSummary, Movement } from '../domain/card'
import type { CardsGateway } from './CardsGateway'

/**
 * Stub: el contrato HTTP está sin definir. No se invoca con la configuración por defecto.
 */
export class HttpCardsGateway implements CardsGateway {
  constructor(readonly baseUrl: string) {}

  private notDefined(): never {
    throw new Error('Integración HTTP sin definir: contrato pendiente.')
  }

  async listCards(): Promise<CardSummary[]> {
    return this.notDefined()
  }

  async getCard(_id: string): Promise<Card | null> {
    return this.notDefined()
  }

  async getMovements(_id: string): Promise<Movement[]> {
    return this.notDefined()
  }
}
