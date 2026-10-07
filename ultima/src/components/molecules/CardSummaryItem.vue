<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '../../domain/card'
import BaseBadge from '../atoms/BaseBadge.vue'
import MaskedCardNumber from '../atoms/MaskedCardNumber.vue'

const props = defineProps<{ card: Card; selected: boolean }>()
defineEmits<{ (e: 'select', id: string): void }>()

const statusLabel = computed(
  () => ({ active: 'Activa', blocked: 'Bloqueada', expired: 'Vencida' })[props.card.status]
)
const tone = computed(() => (props.card.status === 'active' ? 'success' : 'danger'))
const typeLabel = computed(() => (props.card.type === 'credit' ? 'Crédito' : 'Débito'))
</script>

<template>
  <button
    type="button"
    class="item"
    :class="{ 'item--selected': selected }"
    :aria-pressed="selected"
    @click="$emit('select', card.id)"
  >
    <span class="item__title">{{ card.alias }} · {{ typeLabel }}</span>
    <MaskedCardNumber :last4="card.last4" />
    <BaseBadge :label="statusLabel" :tone="tone" />
  </button>
</template>

<style scoped>
.item {
  display: flex; flex-direction: column; gap: 4px; width: 100%; text-align: left;
  padding: 12px; border: 1px solid #c8ccd2; border-radius: 8px; background: #fff; cursor: pointer;
}
.item:focus-visible { outline: 3px solid var(--color-primary, #0b4fa8); outline-offset: 2px; }
.item--selected { border-color: var(--color-primary, #0b4fa8); box-shadow: 0 0 0 2px var(--color-primary, #0b4fa8); }
.item__title { font-weight: 600; }
</style>
