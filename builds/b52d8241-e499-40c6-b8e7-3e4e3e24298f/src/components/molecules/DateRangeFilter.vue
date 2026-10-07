<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '../atoms/BaseButton.vue'

const emit = defineEmits<{ (e: 'apply', range: { from?: string; to?: string }): void }>()
const from = ref('')
const to = ref('')
const invalid = computed(() => !!from.value && !!to.value && from.value > to.value)

function apply(): void {
  if (invalid.value) return
  emit('apply', { from: from.value || undefined, to: to.value || undefined })
}

function clear(): void {
  from.value = ''
  to.value = ''
  emit('apply', {})
}
</script>

<template>
  <form class="filter" aria-label="Filtro de movimientos" @submit.prevent="apply">
    <label>Desde <input v-model="from" type="date" name="from" /></label>
    <label>Hasta <input v-model="to" type="date" name="to" /></label>
    <BaseButton type="submit" :disabled="invalid">Filtrar</BaseButton>
    <BaseButton variant="secondary" @click="clear">Limpiar</BaseButton>
    <p v-if="invalid" class="msg--error" role="alert">La fecha inicial no puede ser posterior a la final.</p>
  </form>
</template>
