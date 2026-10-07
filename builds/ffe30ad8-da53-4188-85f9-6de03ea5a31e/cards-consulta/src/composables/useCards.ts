import { computed, ref } from 'vue';
import type { Card } from '../domain/card';
import type { CardsRepository } from '../services/CardsRepository';

export type ViewState = 'loading' | 'error' | 'empty' | 'data';

export function useCards(repository: CardsRepository) {
  const cards = ref<Card[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedId = ref<string | null>(null);

  const state = computed<ViewState>(() => {
    if (loading.value) return 'loading';
    if (error.value) return 'error';
    if (cards.value.length === 0) return 'empty';
    return 'data';
  });

  const selected = computed<Card | null>(
    () => cards.value.find((c) => c.id === selectedId.value) ?? null,
  );

  async function load(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      cards.value = await repository.list();
      if (!cards.value.some((c) => c.id === selectedId.value)) {
        selectedId.value = null;
      }
    } catch (e) {
      cards.value = [];
      error.value = e instanceof Error ? e.message : 'Error desconocido';
    } finally {
      loading.value = false;
    }
  }

  function select(id: string | null): void {
    selectedId.value = id;
  }

  return { cards, loading, error, selected, selectedId, state, load, select };
}
