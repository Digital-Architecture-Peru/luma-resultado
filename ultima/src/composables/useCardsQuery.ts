import { computed, ref } from 'vue'
import type { Card } from '../domain/card'
import type { Movement, MovementFilter } from '../domain/movement'
import type { CardsRepository } from '../domain/cards-repository'

export type QueryStatus = 'loading' | 'empty' | 'error' | 'ready'
export type MovementsStatus = 'idle' | 'loading' | 'error' | 'ready'

function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : 'Error inesperado'
}

export function useCardsQuery(repo: CardsRepository) {
  const status = ref<QueryStatus>('loading')
  const errorMessage = ref('')
  const cards = ref<Card[]>([])
  const selectedId = ref<string | null>(null)
  const movements = ref<Movement[]>([])
  const movementsStatus = ref<MovementsStatus>('idle')
  const movementsError = ref('')
  const filter = ref<MovementFilter>({})
  let token = 0

  const selectedCard = computed(() => cards.value.find((c) => c.id === selectedId.value) ?? null)

  async function loadMovements(): Promise<void> {
    if (!selectedId.value) return
    const current = ++token
    movementsStatus.value = 'loading'
    movementsError.value = ''
    try {
      const result = await repo.listMovements(selectedId.value, { ...filter.value })
      if (current !== token) return // respuesta obsoleta
      movements.value = result
      movementsStatus.value = 'ready'
    } catch (e) {
      if (current !== token) return
      movements.value = []
      movementsError.value = messageOf(e)
      movementsStatus.value = 'error'
    }
  }

  async function load(): Promise<void> {
    status.value = 'loading'
    errorMessage.value = ''
    try {
      cards.value = await repo.listCards()
      if (cards.value.length === 0) {
        status.value = 'empty'
        return
      }
      status.value = 'ready'
    } catch (e) {
      errorMessage.value = messageOf(e)
      status.value = 'error'
    }
  }

  async function select(id: string): Promise<void> {
    if (!cards.value.some((c) => c.id === id)) return
    selectedId.value = id
    filter.value = {}
    await loadMovements()
  }

  async function applyFilter(next: MovementFilter): Promise<void> {
    filter.value = { from: next.from || undefined, to: next.to || undefined }
    await loadMovements()
  }

  return {
    status, errorMessage, cards, selectedId, selectedCard,
    movements, movementsStatus, movementsError, filter,
    load, select, applyFilter,
  }
}
