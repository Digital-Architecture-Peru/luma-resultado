<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ last4: string }>()
const safe = computed(() => (/^\d{4}$/.test(props.last4) ? props.last4 : '----'))
</script>

<template>
  <span class="masked-pan" :aria-label="`Tarjeta terminada en ${safe}`">•••• {{ safe }}</span>
</template>
