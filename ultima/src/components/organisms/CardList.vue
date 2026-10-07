<script setup lang="ts">
import type { CardSummary } from '../../domain/card'
import CardSummaryItem from '../molecules/CardSummaryItem.vue'

defineProps<{ cards: CardSummary[]; selectedId?: string | null }>()
const emit = defineEmits<{ (e: 'select', id: string): void }>()
</script>

<template>
  <ul class="card-list" aria-label="Mis tarjetas">
    <li v-for="c in cards" :key="c.id">
      <CardSummaryItem :card="c" :selected="c.id === selectedId" @select="emit('select', $event)" />
    </li>
  </ul>
</template>

<style scoped>
.card-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.75rem; }
</style>
