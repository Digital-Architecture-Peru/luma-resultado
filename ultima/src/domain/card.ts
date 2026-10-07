export type CardNetwork = 'VISA' | 'MASTERCARD'
export type CardType = 'credit' | 'debit'
export type CardStatus = 'active' | 'blocked' | 'expired'

export interface CardSummary {
  id: string
  alias: string
  network: CardNetwork
  type: CardType
  last4: string
  status: CardStatus
  currency: string
  availableBalance: number
}

export interface Card extends CardSummary {
  holder: string
  creditLimit: number
  currentBalance: number
  /** Fecha ISO yyyy-mm-dd */
  cutoffDate: string
  dueDate: string
  minimumPayment: number
}

export interface Movement {
  id: string
  /** Fecha ISO yyyy-mm-dd */
  date: string
  description: string
  /** Negativo = cargo, positivo = abono */
  amount: number
  currency: string
}
