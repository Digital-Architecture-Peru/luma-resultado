<script setup lang="ts">
import CardsPage from './components/templates/CardsPage.vue';
import { InMemoryCardRepository } from './services/cardRepository';

// Único punto de composición: sustituir por el adaptador real cuando se defina la integración.
const repository = new InMemoryCardRepository();
</script>

<template>
  <CardsPage :repository="repository" />
</template>
