<script setup lang="ts">
import type { Card } from '../../domain/card';
import MaskedCardNumber from '../atoms/MaskedCardNumber.vue';
import StatusBadge from '../atoms/StatusBadge.vue';

defineProps<{ card: Card; selected: boolean }>();
const emit = defineEmits<{ (e: 'select', id: string): void }>();
</script>

<template>
  <button
    type="button"
    class="item"
    :class="{ 'item--selected': selected }"
    :aria-pressed="selected"
    @click="emit('select', card.id)"
  >
    <span class="item__title">{{ card.alias }} · {{ card.brand }}</span>
    <MaskedCardNumber :last4="card.last4" />
    <StatusBadge :status="card.status" />
  </button>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: #fff;
  color: #111827;
  border: 1px solid #9ca3af;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
}
.item:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }
.item--selected { border: 2px solid #1d4ed8; background: #eff6ff; }
.item__title { font-weight: 600; }
</style>
