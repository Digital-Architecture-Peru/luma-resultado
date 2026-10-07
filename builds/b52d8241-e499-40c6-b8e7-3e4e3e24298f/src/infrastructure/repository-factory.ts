import type { CardsRepository } from '../domain/cards-repository'
import { MockCardsRepository } from './mock-cards-repository'

export function createCardsRepository(source: string | undefined = import.meta.env.VITE_CARDS_SOURCE): CardsRepository {
  switch (source ?? 'mock') {
    case 'mock':
      return new MockCardsRepository({ latencyMs: 300 })
    default:
      // Integracion HTTP sin definir: se implementa cuando exista contrato.
      throw new Error(`Origen de datos no soportado: ${String(source)}`)
  }
}
