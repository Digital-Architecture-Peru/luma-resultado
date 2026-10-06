<script setup lang="ts">
import type { Card } from '../../domain/card'
import CardSummaryItem from '../molecules/CardSummaryItem.vue'

defineProps<{ cards: Card[]; selectedId: string | null }>()
defineEmits<{ (e: 'select', id: string): void }>()
</script>

<template>
  <ul class="list" aria-label="Mis tarjetas">
    <li v-for="card in cards" :key="card.id">
      <CardSummaryItem :card="card" :selected="card.id === selectedId" @select="$emit('select', $event)" />
    </li>
  </ul>
</template>

<style scoped>
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2); }
</style>
