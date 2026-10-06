<script setup lang="ts">
import BaseSpinner from '../atoms/BaseSpinner.vue'

defineProps<{ state: 'loading' | 'empty' | 'error'; message?: string }>()
defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div v-if="state === 'loading'" class="msg" role="status" aria-live="polite">
    <BaseSpinner /> <span>Cargando tus tarjetas…</span>
  </div>
  <div v-else-if="state === 'empty'" class="msg" role="status" aria-live="polite">
    <span>No tienes tarjetas para mostrar.</span>
  </div>
  <div v-else class="msg msg--error" role="alert">
    <span>{{ message || 'Ocurrió un error.' }}</span>
    <button type="button" @click="$emit('retry')">Reintentar</button>
  </div>
</template>

<style scoped>
.msg { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-3); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); }
.msg--error { border-color: var(--color-danger); color: var(--color-danger); }
button { margin-left: auto; padding: var(--space-2) var(--space-3); border: 1px solid var(--color-primary); background: var(--color-surface); color: var(--color-primary); border-radius: var(--radius); cursor: pointer; }
</style>
