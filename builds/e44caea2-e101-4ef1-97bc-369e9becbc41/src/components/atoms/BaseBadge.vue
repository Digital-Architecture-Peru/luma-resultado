<script setup lang="ts">
import type { BadgeTone } from '../../domain/labels';

withDefaults(defineProps<{ label: string; tone?: BadgeTone }>(), { tone: 'neutral' });
</script>

<template>
  <!-- El significado se transmite por texto, no solo por color. -->
  <span class="badge" :class="`badge--${tone}`">{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 0 var(--space-2);
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.5rem;
  white-space: nowrap;
}
.badge--neutral {
  background: var(--color-neutral-bg);
  color: var(--color-neutral-text);
}
.badge--success {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}
.badge--warning {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}
.badge--danger {
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
}
</style>
