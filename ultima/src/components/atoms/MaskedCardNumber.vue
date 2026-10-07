<script setup lang="ts">
import { computed } from 'vue'
import { maskCard } from '../../domain/cardFormat'

const props = defineProps<{ last4: string }>()
const masked = computed(() => maskCard(props.last4))
</script>

<template>
  <span class="masked" :aria-label="`Tarjeta terminada en ${last4}`">{{ masked }}</span>
</template>

<style scoped>
.masked { font-family: ui-monospace, monospace; letter-spacing: 0.05em; }
</style>
