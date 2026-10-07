<script setup lang="ts">
import { computed } from 'vue'
import { formatMoney } from '../../composables/useMoneyFormat'

const props = defineProps<{ amount: number; currency: string; locale?: string }>()
const text = computed(() => formatMoney(props.amount, props.currency, props.locale))
</script>

<template>
  <span class="money">{{ text }}</span>
</template>
