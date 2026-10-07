<script setup lang="ts">
defineProps<{ kind: 'loading' | 'empty' | 'error'; message: string }>()
defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div class="msg" :class="`msg--${kind}`" :role="kind === 'error' ? 'alert' : 'status'" aria-live="polite">
    <p>{{ message }}</p>
    <button v-if="kind === 'error'" type="button" @click="$emit('retry')">Reintentar</button>
  </div>
</template>

<style scoped>
.msg { padding: 16px; border-radius: 8px; background: #f4f6f8; }
.msg--error { background: #fbe9e9; color: var(--color-danger, #a01212); }
</style>
