import { ref } from 'vue'
import type { CardSummary } from '../domain/card'
import type { CardsGateway } from '../services/CardsGateway'

export function useCards(gateway: CardsGateway) {
  const cards = ref<CardSummary[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      cards.value = await gateway.listCards()
    } catch {
      cards.value = []
      error.value = 'No pudimos cargar tus tarjetas. Intenta nuevamente.'
    } finally {
      loading.value = false
    }
  }

  return { cards, loading, error, load }
}
