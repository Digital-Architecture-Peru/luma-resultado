<script setup lang="ts">
import type { Movement } from '../../domain/card'
import MovementItem from '../molecules/MovementItem.vue'

defineProps<{ movements: Movement[] }>()
</script>

<template>
  <section aria-labelledby="mov-title">
    <h3 id="mov-title">Últimos movimientos</h3>
    <p v-if="movements.length === 0" class="empty">Sin movimientos recientes.</p>
    <ul v-else class="movement-list">
      <li v-for="m in movements" :key="m.id"><MovementItem :movement="m" /></li>
    </ul>
  </section>
</template>
