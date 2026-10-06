export type CardType = 'CREDITO' | 'DEBITO'
export type CardStatus = 'ACTIVA' | 'BLOQUEADA' | 'CANCELADA'

/** El PAN completo nunca se modela: solo los últimos 4 dígitos. */
export interface Card {
  id: string
  last4: string
  brand: string
  type: CardType
  status: CardStatus
  holderName: string
  creditLimit?: number
  availableBalance: number
  statementBalance?: number
  /** Fecha ISO yyyy-mm-dd */
  dueDate?: string
}
