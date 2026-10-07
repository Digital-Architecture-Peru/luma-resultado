<script setup lang="ts">
import BaseSpinner from '../atoms/BaseSpinner.vue';

defineProps<{ kind: 'loading' | 'empty' | 'error'; message: string }>();
const emit = defineEmits<{ (e: 'retry'): void }>();
</script>

<template>
  <div
    class="status"
    :class="`status--${kind}`"
    :role="kind === 'error' ? 'alert' : 'status'"
    :aria-live="kind === 'error' ? 'assertive' : 'polite'"
    data-testid="status-message"
  >
    <BaseSpinner v-if="kind === 'loading'" />
    <p class="status__text">{{ message }}</p>
    <button v-if="kind === 'error'" type="button" class="status__retry" @click="emit('retry')">
      Reintentar
    </button>
  </div>
</template>

<style scoped>
.status {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
}
.status--error {
  border: 1px solid var(--color-danger-text);
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
}
.status__text {
  margin: 0;
}
.status__retry {
  padding: var(--space-2) var(--space-4);
  font: inherit;
  font-weight: 600;
  color: var(--color-primary-contrast);
  background: var(--color-primary);
  border: 0;
  border-radius: var(--radius);
  cursor: pointer;
}
</style>
