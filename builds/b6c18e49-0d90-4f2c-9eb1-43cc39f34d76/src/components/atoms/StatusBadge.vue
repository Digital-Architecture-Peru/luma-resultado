<script setup lang="ts">
import { computed } from 'vue';
import type { TransactionStatus } from '../../domain/types';

const props = defineProps<{ status: TransactionStatus }>();
const text = computed(() => (props.status === 'approved' ? '✓ Aprobada' : '✕ Rechazada'));
</script>

<template>
  <span class="badge" :class="`badge-${status}`">{{ text }}</span>
</template>
