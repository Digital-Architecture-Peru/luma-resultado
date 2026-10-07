export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED'
export type CardType = 'CREDIT' | 'DEBIT'

export interface CardSummary {
  id: string
  type: CardType
  brand: string
  /** Solo los últimos 4 dígitos; nunca PAN completo ni CVV. */
  last4: string
  status: CardStatus
  holderAlias: string
}

export interface CardDetail extends CardSummary {
  creditLimit: number
  availableBalance: number
  currentBalance: number
  /** ISO yyyy-mm-dd */
  cutoffDate: string
  /** ISO yyyy-mm-dd */
  paymentDueDate: string
}
