<script setup lang="ts">
import type { StatusFilter } from '../../domain/card';

defineProps<{ query: string; status: StatusFilter }>();
const emit = defineEmits<{
  (e: 'update:query', value: string): void;
  (e: 'update:status', value: StatusFilter): void;
}>();

function onQuery(event: Event): void {
  emit('update:query', (event.target as HTMLInputElement).value);
}

function onStatus(event: Event): void {
  emit('update:status', (event.target as HTMLSelectElement).value as StatusFilter);
}
</script>

<template>
  <form class="filter" role="search" @submit.prevent>
    <label class="field">
      <span>Buscar tarjeta</span>
      <input type="search" :value="query" placeholder="Alias, marca o últimos 4" @input="onQuery" />
    </label>
    <label class="field">
      <span>Estado</span>
      <select :value="status" @change="onStatus">
        <option value="todas">Todas</option>
        <option value="activa">Activa</option>
        <option value="bloqueada">Bloqueada</option>
        <option value="vencida">Vencida</option>
      </select>
    </label>
  </form>
</template>
