import type { CardQueryPort } from './CardQueryPort'
import { createMockCardAdapter } from './mockCardAdapter'

export function createCardQueryPort(adapter?: string): CardQueryPort {
  const name = adapter ?? import.meta.env.VITE_CARDS_ADAPTER ?? 'mock'
  if (name === 'mock') return createMockCardAdapter()
  throw new Error(`Adaptador de tarjetas no soportado: ${name}`)
}
