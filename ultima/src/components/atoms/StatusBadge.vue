<script setup lang="ts">
import { computed } from 'vue'
import type { CardStatus } from '../../domain/card'

const props = defineProps<{ status: CardStatus }>()
const LABELS: Record<CardStatus, string> = {
  ACTIVE: 'Activa',
  BLOCKED: 'Bloqueada',
  EXPIRED: 'Vencida'
}
const label = computed(() => LABELS[props.status] ?? props.status)
</script>

<template>
  <span class="badge" :class="`badge--${status.toLowerCase()}`">{{ label }}</span>
</template>

<style scoped>
.badge { display: inline-block; padding: 0.1rem 0.6rem; border-radius: 999px; font-size: 0.8rem; border: 1px solid currentColor; }
.badge--active { color: #14532d; background: #dcfce7; }
.badge--blocked { color: #7f1d1d; background: #fee2e2; }
.badge--expired { color: #374151; background: #f3f4f6; }
</style>
