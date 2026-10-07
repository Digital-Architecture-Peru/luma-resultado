<script setup lang="ts">
import { computed, onMounted } from 'vue';
import PaymentForm from '../organisms/PaymentForm.vue';
import PaymentHistory from '../organisms/PaymentHistory.vue';
import PaymentReceiptCard from '../organisms/PaymentReceiptCard.vue';
import { usePayment } from '../../composables/usePayment';
import type { PaymentGateway } from '../../services/paymentGateway';

const props = defineProps<{ gateway: PaymentGateway }>();

const { accounts, beneficiaries, status, errors, errorMessage, receipt, history, load, submit } =
  usePayment(props.gateway);

const busy = computed(() => status.value === 'loading');
const statusText = computed(() => {
  if (status.value === 'loading') return 'Procesando pago…';
  if (status.value === 'success' && receipt.value) return `Pago ${receipt.value.reference} realizado con éxito.`;
  if (status.value === 'error') return errorMessage.value || 'Revisa los datos del formulario.';
  return '';
});

onMounted(load);
</script>

<template>
  <main class="page">
    <h1>Pagos · Banca por Internet</h1>
    <p role="status" aria-live="polite" :class="['status', `status--${status}`]">{{ statusText }}</p>
    <PaymentForm
      :accounts="accounts"
      :beneficiaries="beneficiaries"
      :errors="errors"
      :busy="busy"
      @submit="submit"
    />
    <PaymentReceiptCard v-if="receipt" :receipt="receipt" />
    <PaymentHistory :items="history" />
  </main>
</template>
