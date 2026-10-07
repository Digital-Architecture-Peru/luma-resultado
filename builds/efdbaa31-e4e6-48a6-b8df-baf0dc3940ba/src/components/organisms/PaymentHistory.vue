<script setup lang="ts">
import { formatMoney, type PaymentReceipt } from '../../domain/payment';

defineProps<{ items: PaymentReceipt[] }>();
</script>

<template>
  <section class="card" aria-label="Pagos de esta sesión">
    <h2>Pagos de esta sesión</h2>
    <p v-if="items.length === 0" class="muted">Aún no realizaste pagos.</p>
    <ul v-else class="history">
      <li v-for="item in items" :key="item.reference">
        <span>{{ item.reference }} · {{ item.request.concept }}</span>
        <strong>{{ formatMoney(item.request.amount) }}</strong>
      </li>
    </ul>
  </section>
</template>
