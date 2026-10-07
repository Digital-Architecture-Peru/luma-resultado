<script setup lang="ts">
import { ACCOUNT_TYPES } from '../../domain/account';
import type { AccountTypeOption } from '../../domain/account';
import { accountTypeLabels } from '../../domain/labels';

defineProps<{ modelValue: AccountTypeOption }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: AccountTypeOption): void }>();

function onChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
  emit('update:modelValue', value as AccountTypeOption);
}
</script>

<template>
  <div class="filter">
    <label class="filter__label" for="account-type-filter">Tipo de cuenta</label>
    <select
      id="account-type-filter"
      class="filter__select"
      :value="modelValue"
      @change="onChange"
    >
      <option value="ALL">Todos los tipos</option>
      <option v-for="type in ACCOUNT_TYPES" :key="type" :value="type">
        {{ accountTypeLabels[type] }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.filter {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  max-width: 20rem;
}
.filter__label {
  font-weight: 600;
}
.filter__select {
  padding: var(--space-2) var(--space-3);
  font: inherit;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-muted);
  border-radius: var(--radius);
}
</style>
