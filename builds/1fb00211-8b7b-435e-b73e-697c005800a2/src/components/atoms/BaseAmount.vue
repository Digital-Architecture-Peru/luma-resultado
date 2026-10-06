<script setup lang="ts">
import { computed } from 'vue'
import { formatMoney, useFormatters } from '../../composables/useFormatters'

const props = defineProps<{ value: number; locale?: string; currency?: string }>()
const fmt = useFormatters()

const text = computed(() =>
  formatMoney(props.value, props.locale ?? fmt.locale, props.currency ?? fmt.currency)
)
</script>

<template>
  <span class="amount">{{ text }}</span>
</template>

<style scoped>
.amount { font-variant-numeric: tabular-nums; font-weight: 600; }
</style>
