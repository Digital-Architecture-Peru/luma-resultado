<script setup lang="ts">
import { computed } from 'vue'
import { maskPan } from '../../utils/format'

const props = defineProps<{ last4: string }>()
const text = computed(() => maskPan(props.last4))
</script>

<template>
  <span class="masked-pan" :aria-label="`Tarjeta terminada en ${last4}`">{{ text }}</span>
</template>

<style scoped>
.masked-pan { font-family: ui-monospace, monospace; letter-spacing: 0.05em; }
</style>
