<script setup lang="ts">
import type { Transaction } from '../../domain/types';
import TransactionItem from '../molecules/TransactionItem.vue';

defineProps<{ transactions: Transaction[]; loading?: boolean }>();
</script>

<template>
  <section class="card-panel" aria-labelledby="history-title">
    <h2 id="history-title">Movimientos</h2>
    <p v-if="loading">Cargando…</p>
    <p v-else-if="transactions.length === 0" class="muted">Aún no hay movimientos.</p>
    <ul v-else class="tx-list">
      <TransactionItem v-for="tx in transactions" :key="tx.id" :transaction="tx" />
    </ul>
  </section>
</template>
