import { computed, ref } from 'vue'
import type { Card, CardMovement } from '../domain/card'
import type { CardsGateway } from '../services/cards-gateway'

export function useCardsQuery(gateway: CardsGateway) {
  const cards = ref<Card[]>([])
  const movements = ref<CardMovement[]>([])
  const selectedId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const selectedCard = computed<Card | null>(
    () => cards.value.find((c) => c.id === selectedId.value) ?? null,
  )

  async function select(id: string): Promise<void> {
    selectedId.value = id
    error.value = null
    loading.value = true
    try {
      const result = await gateway.getMovements(id)
      // Ignora respuestas de una selección anterior.
      if (selectedId.value === id) movements.value = result
    } catch {
      error.value = 'No pudimos cargar los movimientos. Intenta nuevamente.'
      movements.value = []
    } finally {
      loading.value = false
    }
  }

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      cards.value = await gateway.listCards()
      loading.value = false
      if (cards.value.length > 0) await select(cards.value[0].id)
    } catch {
      error.value = 'No pudimos cargar tus tarjetas. Intenta nuevamente.'
      cards.value = []
      movements.value = []
    } finally {
      loading.value = false
    }
  }

  return { cards, movements, selectedId, selectedCard, loading, error, load, select }
}
