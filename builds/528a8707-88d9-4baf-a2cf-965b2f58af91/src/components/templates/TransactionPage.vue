<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTransactions } from '../../composables/useTransactions';
import type { TransactionRequest } from '../../domain/types';
import type { TransactionGateway } from '../../services/transactionGateway';
import TransactionForm from '../organisms/TransactionForm.vue';
import TransactionHistory from '../organisms/TransactionHistory.vue';

const props = defineProps<{ gateway: TransactionGateway }>();

const { cards, history, loadState, submitting, confirmation, errorMessage, load, submit } =
  useTransactions(props.gateway);
const form = ref<InstanceType<typeof TransactionForm> | null>(null);

async function onSubmit(request: TransactionRequest): Promise<void> {
  const ok = await submit(request);
  if (ok) form.value?.reset();
}

onMounted(load);
</script>

<template>
  <main class="page">
    <h1>Transacción con tarjeta</h1>
    <p v-if="loadState === 'loading'" class="field__hint">Cargando tarjetas…</p>
    <p v-if="confirmation" role="status" class="notice notice--success">{{ confirmation }}</p>
    <p v-if="errorMessage" role="alert" class="notice notice--danger">{{ errorMessage }}</p>
    <div v-if="loadState === 'ready'" class="grid">
      <TransactionForm ref="form" :cards="cards" :submitting="submitting" @submit="onSubmit" />
      <TransactionHistory :records="history" />
    </div>
  </main>
</template>
