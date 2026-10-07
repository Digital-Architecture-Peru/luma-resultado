<script setup lang="ts">
import { computed } from 'vue'
import { formatMoney } from '../../utils/format'

const props = defineProps<{ amount: number }>()
const text = computed(() => formatMoney(props.amount))
</script>

<template>
  <span class="money-amount">{{ text }}</span>
</template>

<style scoped>
.money-amount { font-variant-numeric: tabular-nums; font-weight: 600; }
</style>
