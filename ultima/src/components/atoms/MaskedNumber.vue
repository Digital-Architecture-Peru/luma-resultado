<script setup lang="ts">
import { computed } from 'vue';
import { lastDigits, maskAccountNumber } from '../../domain/format';

const props = defineProps<{ number: string }>();

const masked = computed(() => maskAccountNumber(props.number));
const last = computed(() => lastDigits(props.number));
</script>

<template>
  <span class="masked">
    <span aria-hidden="true">{{ masked }}</span>
    <span class="sr-only">Cuenta {{ last ? `terminada en ${last}` : 'con número oculto' }}</span>
  </span>
</template>

<style scoped>
.masked {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}
</style>
