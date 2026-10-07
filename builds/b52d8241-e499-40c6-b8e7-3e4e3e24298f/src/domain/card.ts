export type CardKind = 'credito' | 'debito'
export type CardStatus = 'activa' | 'bloqueada' | 'vencida'

export interface Card {
  id: string
  alias: string
  brand: string
  kind: CardKind
  /** Solo los ultimos 4 digitos; el PAN completo nunca existe en el front. */
  last4: string
  status: CardStatus
  currency: string
  availableBalance: number
  creditLimit?: number
  /** Formato MM/AA */
  expiry: string
}
