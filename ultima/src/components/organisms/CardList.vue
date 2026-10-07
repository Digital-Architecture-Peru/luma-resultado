<script setup lang="ts">
import type { Card } from '../../domain/card';
import CardSummary from '../molecules/CardSummary.vue';

defineProps<{ cards: Card[] }>();
</script>

<template>
  <p v-if="cards.length === 0" class="empty">No hay tarjetas que coincidan con la búsqueda.</p>
  <ul v-else class="card-grid">
    <li v-for="card in cards" :key="card.id">
      <CardSummary :card="card" />
    </li>
  </ul>
</template>
