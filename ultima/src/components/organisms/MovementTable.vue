<script setup lang="ts">
import type { CardMovement } from '../../domain/card'
import MovementRow from '../molecules/MovementRow.vue'

defineProps<{ movements: CardMovement[] }>()
</script>

<template>
  <section aria-labelledby="mov-title">
    <h2 id="mov-title">Últimos movimientos</h2>
    <p v-if="movements.length === 0" class="empty">Sin movimientos recientes.</p>
    <table v-else>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Descripción</th>
          <th scope="col" class="num">Monto</th>
        </tr>
      </thead>
      <tbody>
        <MovementRow v-for="m in movements" :key="m.id" :movement="m" />
      </tbody>
    </table>
  </section>
</template>

<style scoped>
table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 0.5rem; border-bottom: 2px solid #c8ccd4; }
.num { text-align: right; }
.empty { color: #444; }
</style>
