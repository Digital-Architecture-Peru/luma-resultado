import { computed, ref } from 'vue'
import type { Card } from '../domain/card'
import type { CardRepository } from '../domain/cardRepository'

export type QueryState = 'loading' | 'empty' | 'error' | 'success'

export function useCardQuery(repository: CardRepository) {
  const state = ref<QueryState>('loading')
  const cards = ref<Card[]>([])
  const selectedId = ref<string | null>(null)
  const errorMessage = ref('')

  const selected = computed<Card | null>(
    () => cards.value.find((c) => c.id === selectedId.value) ?? null
  )

  async function load(): Promise<void> {
    state.value = 'loading'
    errorMessage.value = ''
    try {
      const result = await repository.listCards()
      cards.value = result
      if (result.length === 0) {
        selectedId.value = null
        state.value = 'empty'
        return
      }
      if (!result.some((c) => c.id === selectedId.value)) {
        selectedId.value = result[0].id
      }
      state.value = 'success'
    } catch {
      cards.value = []
      selectedId.value = null
      errorMessage.value = 'No pudimos cargar tus tarjetas. Intenta nuevamente.'
      state.value = 'error'
    }
  }

  function select(id: string): void {
    if (cards.value.some((c) => c.id === id)) selectedId.value = id
  }

  return { state, cards, selectedId, selected, errorMessage, load, select }
}
