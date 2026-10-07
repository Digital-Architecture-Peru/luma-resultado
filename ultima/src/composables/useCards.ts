import { computed, ref } from 'vue'
import type { Card } from '../domain/card'
import type { CardsRepository } from '../data/CardsRepository'

export type CardsStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export function useCards(repo: CardsRepository) {
  const status = ref<CardsStatus>('idle')
  const cards = ref<Card[]>([])
  const selectedId = ref<string | null>(null)
  const errorMessage = ref('')

  const selected = computed<Card | null>(
    () => cards.value.find((c) => c.id === selectedId.value) ?? null
  )

  async function load(): Promise<void> {
    status.value = 'loading'
    errorMessage.value = ''
    try {
      const result = await repo.list()
      cards.value = result
      if (result.length === 0) {
        selectedId.value = null
        status.value = 'empty'
        return
      }
      selectedId.value = result[0].id
      status.value = 'success'
    } catch {
      cards.value = []
      selectedId.value = null
      errorMessage.value = 'No pudimos consultar tus tarjetas. Inténtalo nuevamente.'
      status.value = 'error'
    }
  }

  function select(id: string): void {
    if (cards.value.some((c) => c.id === id)) selectedId.value = id
  }

  return { status, cards, selectedId, selected, errorMessage, load, select }
}
