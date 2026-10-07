<script setup lang="ts">
import { computed } from 'vue';
import type { CardStatus } from '../../domain/card';
import { statusLabel } from '../../domain/format';

const props = defineProps<{ status: CardStatus }>();
const label = computed(() => statusLabel(props.status));
</script>

<template>
  <!-- El estado se comunica con texto, no solo con color -->
  <span class="badge" :class="`badge--${props.status.toLowerCase()}`">{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid currentColor;
}
.badge--active { color: #14532d; background: #dcfce7; }
.badge--blocked { color: #7f1d1d; background: #fee2e2; }
.badge--expired { color: #374151; background: #f3f4f6; }
</style>
