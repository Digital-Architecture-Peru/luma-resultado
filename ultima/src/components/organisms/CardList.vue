<script setup lang="ts">
import type { CardSummary } from '../../domain/card'
import CardSummaryItem from '../molecules/CardSummaryItem.vue'

defineProps<{ cards: CardSummary[] }>()
defineEmits<{ (e: 'select', id: string): void }>()
</script>

<template>
  <p v-if="cards.length === 0" class="empty">No tienes tarjetas para mostrar.</p>
  <ul v-else class="card-list" aria-label="Mis tarjetas">
    <li v-for="c in cards" :key="c.id">
      <CardSummaryItem :card="c" @select="$emit('select', $event)" />
    </li>
  </ul>
</template>
