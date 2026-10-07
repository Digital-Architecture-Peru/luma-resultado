<script setup lang="ts">
import type { TransactionRecord } from '../../domain/types';
import { formatMoney } from '../../domain/format';
import StatusBadge from '../atoms/StatusBadge.vue';

defineProps<{ records: TransactionRecord[] }>();
</script>

<template>
  <section class="card" aria-labelledby="history-title">
    <h2 id="history-title">Movimientos recientes</h2>
    <p v-if="records.length === 0" class="field__hint">Aún no hay transacciones.</p>
    <table v-else>
      <thead>
        <tr>
          <th scope="col">Referencia</th>
          <th scope="col">Comercio</th>
          <th scope="col" class="num">Monto</th>
          <th scope="col">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.id">
          <td>{{ record.id }}</td>
          <td>{{ record.merchant }}</td>
          <td class="num">{{ formatMoney(record.amount, record.currency) }}</td>
          <td><StatusBadge tone="success">Aprobada</StatusBadge></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
