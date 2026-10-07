<script setup lang="ts">
import type { Card } from '../../domain/card'
import CardSummaryItem from '../molecules/CardSummaryItem.vue'

defineProps<{ cards: Card[]; selectedId: string | null }>()
const emit = defineEmits<{ (e: 'select', id: string): void }>()
</script>

<template>
  <nav aria-label="Mis tarjetas">
    <ul class="card-list">
      <li v-for="card in cards" :key="card.id">
        <CardSummaryItem :card="card" :selected="card.id === selectedId" @select="emit('select', $event)" />
      </li>
    </ul>
  </nav>
</template>
