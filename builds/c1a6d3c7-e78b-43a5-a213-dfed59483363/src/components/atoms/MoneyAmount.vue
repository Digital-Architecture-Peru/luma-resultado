<script setup lang="ts">
import { computed } from 'vue'
import { formatMoney } from '../../domain/cardFormat'
import { config } from '../../config'

const props = defineProps<{ amount: number; currency?: string; locale?: string }>()
const text = computed(() =>
  formatMoney(props.amount, props.currency ?? config.currency, props.locale ?? config.locale)
)
</script>

<template>
  <span class="money">{{ text }}</span>
</template>

<style scoped>
.money { font-variant-numeric: tabular-nums; font-weight: 600; }
</style>
