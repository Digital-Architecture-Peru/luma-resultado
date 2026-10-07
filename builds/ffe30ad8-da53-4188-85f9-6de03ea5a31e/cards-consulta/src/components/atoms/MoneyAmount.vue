<script setup lang="ts">
import { computed } from 'vue';
import { formatMoney } from '../../domain/format';

const props = defineProps<{ amount: number; currency: string }>();
const text = computed(() => formatMoney(props.amount, props.currency));
</script>

<template>
  <span class="money">{{ text }}</span>
</template>

<style scoped>
.money {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
</style>
