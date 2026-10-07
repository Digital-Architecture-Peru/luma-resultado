<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ value: number; label: string }>()
const clamped = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <div
    class="bar"
    role="progressbar"
    :aria-label="label"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="clamped"
  >
    <div class="bar__fill" :style="{ width: `${clamped}%` }" />
  </div>
</template>

<style scoped>
.bar { height: 8px; background: #e3e6ea; border-radius: 4px; overflow: hidden; }
.bar__fill { height: 100%; background: var(--color-primary, #0b4fa8); }
</style>
