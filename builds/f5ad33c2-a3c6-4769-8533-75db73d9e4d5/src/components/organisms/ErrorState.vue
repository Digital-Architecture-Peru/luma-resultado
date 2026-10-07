<script setup lang="ts">
defineProps<{ message: string }>()
defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div class="error-state" role="alert">
    <p>{{ message }}</p>
    <button type="button" @click="$emit('retry')">Reintentar</button>
  </div>
</template>
