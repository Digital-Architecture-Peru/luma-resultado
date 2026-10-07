import { ref } from 'vue'
import type { Card, Movement } from '../domain/card'
import type { CardsGateway } from '../services/CardsGateway'

export function useCardDetail(gateway: CardsGateway) {
  const card = ref<Card | null>(null)
  const movements = ref<Movement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const notFound = ref(false)

  async function load(id: string): Promise<void> {
    loading.value = true
    error.value = null
    notFound.value = false
    try {
      const [c, m] = await Promise.all([gateway.getCard(id), gateway.getMovements(id)])
      card.value = c
      movements.value = c ? m : []
      notFound.value = c === null
    } catch {
      card.value = null
      movements.value = []
      error.value = 'No pudimos cargar el detalle de la tarjeta. Intenta nuevamente.'
    } finally {
      loading.value = false
    }
  }

  return { card, movements, loading, error, notFound, load }
}
