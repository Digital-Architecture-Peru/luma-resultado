<script setup lang="ts">
import { computed } from 'vue'
import { formatMoney } from '../../utils/format'

const props = defineProps<{ amount: number; currency: string }>()
const text = computed(() => formatMoney(props.amount, props.currency))
</script>

<template>
  <span class="amount" :class="{ 'amount--neg': amount < 0 }">{{ text }}</span>
</template>

<style scoped>
.amount { font-variant-numeric: tabular-nums; }
.amount--neg { color: #8a1c1c; }
</style>
