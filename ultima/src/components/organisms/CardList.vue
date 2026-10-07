<script setup lang="ts">
import type { Card } from '../../domain/card'
import CardSummaryItem from '../molecules/CardSummaryItem.vue'

defineProps<{ cards: Card[]; selectedId: string | null }>()
defineEmits<{ (e: 'select', id: string): void }>()
</script>

<template>
  <section aria-labelledby="cards-title">
    <h2 id="cards-title">Mis tarjetas</h2>
    <p v-if="cards.length === 0" class="empty">No tienes tarjetas para mostrar.</p>
    <ul v-else class="list">
      <li v-for="card in cards" :key="card.id">
        <CardSummaryItem
          :card="card"
          :selected="card.id === selectedId"
          @select="$emit('select', $event)"
        />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.empty { color: #444; }
</style>
