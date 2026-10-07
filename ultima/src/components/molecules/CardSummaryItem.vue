<script setup lang="ts">
import type { Card } from '../../domain/card'
import MaskedPan from '../atoms/MaskedPan.vue'
import StatusBadge from '../atoms/StatusBadge.vue'

defineProps<{ card: Card; selected: boolean }>()
const emit = defineEmits<{ (e: 'select', id: string): void }>()
</script>

<template>
  <button
    type="button"
    class="card-item"
    :aria-pressed="selected"
    :aria-label="`${card.alias}, ${card.brand}, ${card.status}`"
    @click="emit('select', card.id)"
  >
    <strong>{{ card.alias }}</strong>
    <span>{{ card.brand }} · {{ card.kind }}</span>
    <MaskedPan :last4="card.last4" />
    <StatusBadge :status="card.status" />
  </button>
</template>
