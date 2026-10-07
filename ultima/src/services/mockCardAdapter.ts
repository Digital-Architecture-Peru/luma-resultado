import type { CardDetail, CardSummary } from '../domain/card'
import type { CardQueryPort } from './CardQueryPort'

const DATA: CardDetail[] = [
  {
    id: 'c-001',
    type: 'CREDIT',
    brand: 'Visa',
    last4: '4821',
    status: 'ACTIVE',
    holderAlias: 'Ana Ejemplo',
    creditLimit: 10000,
    availableBalance: 6500.5,
    currentBalance: 3499.5,
    cutoffDate: '2026-10-20',
    paymentDueDate: '2026-11-05'
  },
  {
    id: 'c-002',
    type: 'DEBIT',
    brand: 'Mastercard',
    last4: '1093',
    status: 'ACTIVE',
    holderAlias: 'Ana Ejemplo',
    creditLimit: 0,
    availableBalance: 1250,
    currentBalance: 1250,
    cutoffDate: '2026-10-31',
    paymentDueDate: '2026-10-31'
  },
  {
    id: 'c-003',
    type: 'CREDIT',
    brand: 'Visa',
    last4: '7766',
    status: 'BLOCKED',
    holderAlias: 'Ana Ejemplo',
    creditLimit: 5000,
    availableBalance: 0,
    currentBalance: 5000,
    cutoffDate: '2026-10-15',
    paymentDueDate: '2026-10-30'
  }
]

function toSummary(d: CardDetail): CardSummary {
  const { id, type, brand, last4, status, holderAlias } = d
  return { id, type, brand, last4, status, holderAlias }
}

export function createMockCardAdapter(delayMs = 200): CardQueryPort {
  const wait = () => new Promise<void>((r) => setTimeout(r, delayMs))
  return {
    async listCards() {
      await wait()
      return DATA.map(toSummary)
    },
    async getCard(id: string) {
      await wait()
      const found = DATA.find((d) => d.id === id)
      if (!found) throw new Error('Tarjeta no encontrada')
      return { ...found }
    }
  }
}
