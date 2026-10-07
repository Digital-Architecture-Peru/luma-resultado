<script setup lang="ts">
import { computed } from 'vue'
import { formatMoney } from '../../domain/money'
import { LOCALE } from '../../config'

const props = defineProps<{ amount: number; currency: string; signed?: boolean }>()
const text = computed(() => formatMoney(props.amount, props.currency, LOCALE))
const kind = computed(() => (props.signed ? (props.amount < 0 ? 'neg' : 'pos') : 'plain'))
</script>

<template>
  <span class="money" :class="`money--${kind}`">{{ text }}</span>
</template>
