<script setup lang="ts">
import type { CardSummary } from '../../domain/card'
import MaskedPan from '../atoms/MaskedPan.vue'
import StatusBadge from '../atoms/StatusBadge.vue'

defineProps<{ card: CardSummary; selected?: boolean }>()
const emit = defineEmits<{ (e: 'select', id: string): void }>()
</script>

<template>
  <button
    type="button"
    class="card-item"
    :class="{ 'card-item--selected': selected }"
    :aria-pressed="selected ? 'true' : 'false'"
    @click="emit('select', card.id)"
  >
    <span class="card-item__title">{{ card.brand }} · {{ card.type === 'CREDIT' ? 'Crédito' : 'Débito' }}</span>
    <MaskedPan :last4="card.last4" />
    <StatusBadge :status="card.status" />
  </button>
</template>

<style scoped>
.card-item { display: flex; flex-direction: column; gap: 0.3rem; width: 100%; text-align: left; padding: 0.8rem; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; cursor: pointer; }
.card-item:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }
.card-item--selected { border-color: #1d4ed8; box-shadow: 0 0 0 1px #1d4ed8; }
.card-item__title { font-weight: 600; }
</style>
