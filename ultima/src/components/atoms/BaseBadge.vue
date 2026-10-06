<script setup lang="ts">
withDefaults(defineProps<{ label: string; tone?: 'success' | 'warning' | 'neutral' }>(), {
  tone: 'neutral'
})
</script>

<template>
  <span class="badge" :class="`badge--${tone}`">{{ label }}</span>
</template>

<style scoped>
.badge { display: inline-block; padding: 0.125rem 0.625rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; }
.badge--success { background: var(--color-success-bg); color: var(--color-success-fg); }
.badge--warning { background: var(--color-warning-bg); color: var(--color-warning-fg); }
.badge--neutral { background: var(--color-neutral-bg); color: var(--color-neutral-fg); }
</style>
