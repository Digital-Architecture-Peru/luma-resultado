<script setup lang="ts">
import { computed } from 'vue';
import { maskCardNumber } from '../../domain/format';

const props = defineProps<{ last4: string }>();
const masked = computed(() => maskCardNumber(props.last4));
</script>

<template>
  <span class="masked" :aria-label="`Tarjeta terminada en ${props.last4}`">{{ masked }}</span>
</template>

<style scoped>
.masked {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}
</style>
