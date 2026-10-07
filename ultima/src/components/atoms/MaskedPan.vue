<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ last4: string }>()
const safe = computed(() => props.last4.replace(/\D/g, '').slice(-4))
</script>

<template>
  <span class="pan" :aria-label="`Tarjeta terminada en ${safe}`">**** {{ safe }}</span>
</template>

<style scoped>
.pan {
  font-family: ui-monospace, monospace;
  letter-spacing: 0.05em;
}
</style>
