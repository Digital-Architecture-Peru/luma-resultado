import type { InjectionKey } from 'vue'
import type { CardsGateway } from './CardsGateway'
import { HttpCardsGateway } from './HttpCardsGateway'
import { MockCardsGateway } from './MockCardsGateway'

export interface GatewayEnv {
  adapter?: string
  baseUrl?: string
}

export const cardsGatewayKey: InjectionKey<CardsGateway> = Symbol('CardsGateway')

export function createGateway(env: GatewayEnv = {}): CardsGateway {
  const adapter = (env.adapter ?? 'mock').trim().toLowerCase() || 'mock'
  if (adapter === 'mock') return new MockCardsGateway()
  if (adapter === 'http') {
    if (!env.baseUrl) throw new Error('VITE_API_BASE_URL es obligatoria con el adaptador http.')
    return new HttpCardsGateway(env.baseUrl)
  }
  throw new Error(`Adaptador desconocido: "${adapter}". Use mock o http.`)
}

export function createGatewayFromEnv(): CardsGateway {
  return createGateway({
    adapter: import.meta.env.VITE_CARDS_ADAPTER,
    baseUrl: import.meta.env.VITE_API_BASE_URL
  })
}
