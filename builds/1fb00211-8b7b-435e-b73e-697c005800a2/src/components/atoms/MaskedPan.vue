<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ last4: string }>()
const valid = computed(() => /^\d{4}$/.test(props.last4))
</script>

<template>
  <span v-if="valid" class="pan" :aria-label="`Tarjeta terminada en ${last4}`">•••• {{ last4 }}</span>
  <span v-else class="pan" aria-label="Número de tarjeta no disponible">••••</span>
</template>

<style scoped>
.pan { font-family: ui-monospace, Menlo, Consolas, monospace; letter-spacing: 0.05em; }
</style>
