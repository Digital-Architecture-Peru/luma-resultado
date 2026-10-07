<script setup lang="ts">
import { computed } from 'vue'
import { maskPan } from '../../domain/mask'

const props = defineProps<{ last4: string }>()
const masked = computed(() => maskPan(props.last4))
</script>

<template>
  <span class="pan" :aria-label="`Tarjeta terminada en ${masked.slice(-4)}`">{{ masked }}</span>
</template>
