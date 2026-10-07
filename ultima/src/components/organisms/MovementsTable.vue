<script setup lang="ts">
import type { Movement } from '../../domain/movement'
import type { MovementsStatus } from '../../composables/useCardsQuery'
import MovementRow from '../molecules/MovementRow.vue'

defineProps<{ movements: Movement[]; status: MovementsStatus; errorMessage?: string }>()
</script>

<template>
  <div aria-live="polite">
    <p v-if="status === 'loading'" class="msg--muted">Cargando movimientos...</p>
    <p v-else-if="status === 'error'" class="msg--error" role="alert">
      No se pudieron cargar los movimientos. {{ errorMessage }}
    </p>
    <p v-else-if="status === 'ready' && movements.length === 0" class="msg--muted">
      No hay movimientos para el periodo seleccionado.
    </p>
    <table v-else-if="status === 'ready'" class="table">
      <caption>Movimientos</caption>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Descripcion</th>
          <th scope="col" class="num">Monto</th>
          <th scope="col">Estado</th>
        </tr>
      </thead>
      <tbody>
        <MovementRow v-for="m in movements" :key="m.id" :movement="m" />
      </tbody>
    </table>
  </div>
</template>
