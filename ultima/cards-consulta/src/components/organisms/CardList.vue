<script setup lang="ts">
import type { Card } from '../../domain/card';
import CardSummaryItem from '../molecules/CardSummaryItem.vue';

defineProps<{ cards: Card[]; selectedId: string | null }>();
const emit = defineEmits<{ (e: 'select', id: string): void }>();
</script>

<template>
  <ul class="list" aria-label="Listado de tarjetas">
    <li v-for="card in cards" :key="card.id">
      <CardSummaryItem
        :card="card"
        :selected="card.id === selectedId"
        @select="(id: string) => emit('select', id)"
      />
    </li>
  </ul>
</template>

<style scoped>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
</style>
