<script setup lang="ts">
import type { Card } from '../../domain/types';
import { formatMoney } from '../../domain/validation';

withDefaults(
  defineProps<{ cards: Card[]; modelValue: string; error?: string }>(),
  { error: '' },
);

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

function onChange(event: Event): void {
  emit('update:modelValue', (event.target as HTMLSelectElement).value);
}
</script>

<template>
  <div class="field">
    <label for="card-select">Tarjeta</label>
    <select
      id="card-select"
      :value="modelValue"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? 'card-select-error' : undefined"
      @change="onChange"
    >
      <option value="">Selecciona…</option>
      <option v-for="card in cards" :key="card.id" :value="card.id" :disabled="card.status === 'blocked'">
        {{ card.alias }} •••• {{ card.last4 }} ({{ card.status === 'blocked' ? 'bloqueada' : formatMoney(card.available) }})
      </option>
    </select>
    <p v-if="error" id="card-select-error" class="field-error">{{ error }}</p>
  </div>
</template>
