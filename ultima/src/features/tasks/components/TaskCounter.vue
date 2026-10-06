<script setup lang="ts">
import type { TaskCounts } from '../domain/task'

defineProps<{ counts: TaskCounts }>()
</script>

<template>
  <p class="counter" role="status" aria-live="polite" data-testid="counter">
    {{ counts.pending }} pendientes de {{ counts.total }} ({{ counts.done }} completadas)
  </p>
</template>
