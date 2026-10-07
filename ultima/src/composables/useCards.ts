import { computed, ref } from 'vue'
import type { CardDetail, CardSummary } from '../domain/card'
import type { CardQueryPort } from '../services/CardQueryPort'

export function useCards(port: CardQueryPort) {
  const cards = ref<CardSummary[]>([])
  const selected = ref<CardDetail | null>(null)
  const loading = ref(false)
  const detailLoading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  const empty = computed(() => loaded.value && !loading.value && !error.value && cards.value.length === 0)

  function messageOf(e: unknown): string {
    return e instanceof Error ? e.message : 'Error inesperado'
  }

  async function loadCards() {
    loading.value = true
    error.value = null
    try {
      cards.value = await port.listCards()
    } catch (e) {
      cards.value = []
      error.value = messageOf(e)
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  async function selectCard(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      selected.value = await port.getCard(id)
    } catch (e) {
      selected.value = null
      error.value = messageOf(e)
    } finally {
      detailLoading.value = false
    }
  }

  function clearSelection() {
    selected.value = null
  }

  return { cards, selected, loading, detailLoading, error, empty, loadCards, selectCard, clearSelection }
}
