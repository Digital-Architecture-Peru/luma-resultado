<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Cargando…' })
</script>

<template>
  <div class="spinner" role="status" aria-live="polite">
    <span class="spinner__dot" aria-hidden="true"></span>
    <span>{{ label }}</span>
  </div>
</template>
