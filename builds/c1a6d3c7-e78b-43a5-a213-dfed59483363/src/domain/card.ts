export type CardType = 'credit' | 'debit'
export type CardStatus = 'active' | 'blocked' | 'expired'

/** Tarjeta de consulta. Solo se guardan los últimos 4 dígitos (nunca el PAN). */
export interface Card {
  id: string
  alias: string
  brand: string
  type: CardType
  status: CardStatus
  last4: string
  holder: string
  currency: string
  /** Solo crédito */
  creditLimit?: number
  available: number
  balance: number
  /** ISO yyyy-mm-dd, solo crédito */
  cutOffDate?: string
  paymentDueDate?: string
  expiry: string
}
