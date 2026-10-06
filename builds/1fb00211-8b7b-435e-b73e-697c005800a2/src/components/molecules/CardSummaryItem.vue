<script setup lang="ts">
import type { Card } from '../../domain/card'
import BaseBadge from '../atoms/BaseBadge.vue'
import MaskedPan from '../atoms/MaskedPan.vue'

defineProps<{ card: Card; selected: boolean }>()
defineEmits<{ (e: 'select', id: string): void }>()

const statusTone = { ACTIVA: 'success', BLOQUEADA: 'warning', CANCELADA: 'neutral' } as const
const typeLabel = { CREDITO: 'Crédito', DEBITO: 'Débito' } as const
const statusLabel = { ACTIVA: 'Activa', BLOQUEADA: 'Bloqueada', CANCELADA: 'Cancelada' } as const
</script>

<template>
  <button type="button" class="item" :class="{ 'item--selected': selected }" :aria-pressed="selected" @click="$emit('select', card.id)">
    <span class="item__title">{{ card.brand }} {{ typeLabel[card.type] }}</span>
    <MaskedPan :last4="card.last4" />
    <BaseBadge :label="statusLabel[card.status]" :tone="statusTone[card.status]" />
  </button>
</template>

<style scoped>
.item { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-1); width: 100%; padding: var(--space-3); text-align: left; background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); border-radius: var(--radius); cursor: pointer; font: inherit; }
.item--selected { border: 2px solid var(--color-primary); }
.item__title { font-weight: 600; }
</style>
