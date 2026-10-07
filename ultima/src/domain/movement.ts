export type MovementStatus = 'procesado' | 'pendiente'

export interface Movement {
  id: string
  cardId: string
  /** Fecha ISO (YYYY-MM-DD o fecha-hora ISO) */
  date: string
  description: string
  /** Negativo = cargo, positivo = abono */
  amount: number
  currency: string
  status: MovementStatus
}

export interface MovementFilter {
  /** YYYY-MM-DD inclusive */
  from?: string
  /** YYYY-MM-DD inclusive */
  to?: string
}
