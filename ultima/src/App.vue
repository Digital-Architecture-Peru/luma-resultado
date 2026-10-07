<script setup lang="ts">
import TransactionPage from './components/templates/TransactionPage.vue';
import { InMemoryGateway } from './services/inMemoryGateway';

// Punto único de composición: aquí se cambiará por el adaptador HTTP (VITE_API_BASE_URL).
const gateway = new InMemoryGateway();
</script>

<template>
  <TransactionPage :gateway="gateway" />
</template>
