export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED'

export interface Card {
  id: string
  alias: string
  brand: string
  /** Solo los últimos 4 dígitos; el PAN completo nunca se maneja en el front. */
  last4: string
  holderName: string
  status: CardStatus
  currency: string
  creditLimit: number
  availableBalance: number
  expiry: string
}

export interface CardMovement {
  id: string
  cardId: string
  date: string
  description: string
  amount: number
  currency: string
}

export const STATUS_LABEL: Record<CardStatus, string> = {
  ACTIVE: 'Activa',
  BLOCKED: 'Bloqueada',
  EXPIRED: 'Vencida',
}
