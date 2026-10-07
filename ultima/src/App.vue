<script setup lang="ts">
import TransactionPage from './components/pages/TransactionPage.vue';
import { createInMemoryGateway } from './services/transactionGateway';

// Único punto de composición: sustituir por el adaptador real cuando se defina la integración.
const gateway = createInMemoryGateway();
</script>

<template>
  <TransactionPage :gateway="gateway" />
</template>
