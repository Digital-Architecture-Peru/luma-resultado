<script setup lang="ts">
import type { Transaction } from '../../domain/types';
import { formatMoney } from '../../domain/validation';
import StatusBadge from '../atoms/StatusBadge.vue';

defineProps<{ transaction: Transaction }>();
</script>

<template>
  <li class="tx-item">
    <div>
      <strong>{{ transaction.merchant }}</strong>
      <small>{{ transaction.id }}</small>
    </div>
    <div class="tx-right">
      <span class="amount">{{ formatMoney(transaction.amount) }}</span>
      <StatusBadge :status="transaction.status" />
    </div>
  </li>
</template>
