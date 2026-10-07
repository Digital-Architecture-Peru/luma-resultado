<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'success' | 'danger' | 'neutral'; label: string }>(), {
  tone: 'neutral'
})
</script>

<template>
  <span class="badge" :class="`badge--${tone}`">{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid currentColor;
}
.badge--success { color: var(--color-success, #0b6b3a); background: #e6f4ec; }
.badge--danger { color: var(--color-danger, #a01212); background: #fbe9e9; }
.badge--neutral { color: var(--color-muted, #444b55); background: #eef0f3; }
</style>
