<script setup lang="ts">
import { computed } from 'vue';
import { appLocale } from '../../config';
import { formatMoney } from '../../domain/format';

const props = defineProps<{
  amountMinor: number;
  currency: string;
  locale?: string;
}>();

const text = computed(() => {
  try {
    return formatMoney(props.amountMinor, props.currency, props.locale ?? appLocale);
  } catch {
    // Dato invalido: no rompe la renderizacion de la lista.
    return '—';
  }
});
</script>

<template>
  <span class="amount" :class="{ 'amount--negative': amountMinor < 0 }">{{ text }}</span>
</template>

<style scoped>
.amount {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
.amount--negative {
  color: var(--color-danger-text);
}
</style>
