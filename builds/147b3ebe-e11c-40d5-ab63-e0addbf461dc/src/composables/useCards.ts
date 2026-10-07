import { computed, ref } from 'vue';
import { filterCards } from '../domain/card';
import type { Card, StatusFilter } from '../domain/card';
import type { CardRepository } from '../services/cardRepository';

export type LoadState = 'idle' | 'loading' | 'success' | 'error';

export function useCards(repository: CardRepository) {
  const cards = ref<Card[]>([]);
  const state = ref<LoadState>('idle');
  const query = ref('');
  const status = ref<StatusFilter>('todas');

  const visibleCards = computed(() =>
    filterCards(cards.value, { query: query.value, status: status.value }),
  );

  async function load(): Promise<void> {
    state.value = 'loading';
    try {
      cards.value = await repository.list();
      state.value = 'success';
    } catch {
      cards.value = [];
      state.value = 'error';
    }
  }

  return { cards, state, query, status, visibleCards, load };
}
