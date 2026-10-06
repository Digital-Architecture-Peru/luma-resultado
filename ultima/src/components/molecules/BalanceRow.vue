<script setup lang="ts">
import BaseAmount from '../atoms/BaseAmount.vue'

defineProps<{ label: string; value?: number }>()
</script>

<template>
  <div class="row">
    <dt>{{ label }}</dt>
    <dd>
      <BaseAmount v-if="value !== undefined" :value="value" />
      <span v-else class="na">No aplica</span>
    </dd>
  </div>
</template>

<style scoped>
.row { display: flex; justify-content: space-between; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border); }
dt { color: var(--color-muted); }
dd { margin: 0; }
.na { color: var(--color-muted); }
</style>
