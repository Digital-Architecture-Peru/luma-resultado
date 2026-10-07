<script setup lang="ts">
import PaymentPage from './components/pages/PaymentPage.vue';
import { InMemoryPaymentGateway } from './services/paymentGateway';

// Único punto de composición: aquí se cambiará el adaptador en memoria por el real.
const gateway = new InMemoryPaymentGateway();
</script>

<template>
  <PaymentPage :gateway="gateway" />
</template>
