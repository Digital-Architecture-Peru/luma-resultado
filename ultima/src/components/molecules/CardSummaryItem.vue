<script setup lang="ts">
import type { Card } from '../../domain/card'
import MaskedPan from '../atoms/MaskedPan.vue'
import BaseBadge from '../atoms/BaseBadge.vue'

defineProps<{ card: Card; selected: boolean }>()
defineEmits<{ (e: 'select', id: string): void }>()
</script>

<template>
  <button
    type="button"
    class="item"
    :class="{ 'item--selected': selected }"
    :aria-pressed="selected"
    @click="$emit('select', card.id)"
  >
    <strong>{{ card.alias }}</strong>
    <MaskedPan :last4="card.last4" />
    <BaseBadge :status="card.status" />
  </button>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  text-align: left;
  padding: 0.75rem;
  border: 1px solid #c8ccd4;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
.item:focus-visible { outline: 3px solid #1a56db; outline-offset: 2px; }
.item--selected { border-color: #1a56db; background: #eef3ff; }
</style>
