<script setup lang="ts">
import { computed } from 'vue';
import type { Card } from '../../domain/types';
import { formatMoney } from '../../domain/format';

const props = defineProps<{ cards: Card[]; modelValue: string; error?: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const selected = computed(() => props.cards.find((c) => c.id === props.modelValue));

function onChange(event: Event): void {
  emit('update:modelValue', (event.target as HTMLSelectElement).value);
}

function optionLabel(card: Card): string {
  const suffix = card.status === 'blocked' ? ' · bloqueada' : '';
  return `${card.alias} ····${card.last4}${suffix}`;
}
</script>

<template>
  <div class="field">
    <label for="card-select">Tarjeta</label>
    <select
      id="card-select"
      class="input"
      :value="modelValue"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? 'card-select-error' : undefined"
      @change="onChange"
    >
      <option value="">Selecciona una tarjeta</option>
      <option v-for="card in cards" :key="card.id" :value="card.id">{{ optionLabel(card) }}</option>
    </select>
    <p v-if="selected" class="field__hint">
      Cupo disponible: {{ formatMoney(selected.availableLimit, selected.currency) }}
    </p>
    <p v-if="error" id="card-select-error" class="field__error">{{ error }}</p>
  </div>
</template>
