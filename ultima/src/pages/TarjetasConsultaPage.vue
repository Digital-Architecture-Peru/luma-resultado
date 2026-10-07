<script setup lang="ts">
import { onMounted } from 'vue'
import type { CardsRepository } from '../domain/cards-repository'
import { createCardsRepository } from '../infrastructure/repository-factory'
import { useCardsQuery } from '../composables/useCardsQuery'
import ConsultaLayout from '../components/templates/ConsultaLayout.vue'
import CardList from '../components/organisms/CardList.vue'
import CardDetailPanel from '../components/organisms/CardDetailPanel.vue'
import MovementsTable from '../components/organisms/MovementsTable.vue'
import DateRangeFilter from '../components/molecules/DateRangeFilter.vue'
import BaseButton from '../components/atoms/BaseButton.vue'

const props = defineProps<{ repository?: CardsRepository }>()
const q = useCardsQuery(props.repository ?? createCardsRepository())

onMounted(() => { void q.load() })
</script>

<template>
  <ConsultaLayout title="Consulta de tarjetas">
    <template #list>
      <div aria-live="polite">
        <p v-if="q.status.value === 'loading'" class="msg--muted">Cargando tarjetas...</p>
        <div v-else-if="q.status.value === 'error'">
          <p class="msg--error" role="alert">No se pudieron cargar las tarjetas. {{ q.errorMessage.value }}</p>
          <BaseButton @click="q.load()">Reintentar</BaseButton>
        </div>
        <p v-else-if="q.status.value === 'empty'" class="msg--muted">No tienes tarjetas registradas.</p>
      </div>
      <CardList
        v-if="q.status.value === 'ready'"
        :cards="q.cards.value"
        :selected-id="q.selectedId.value"
        @select="q.select($event)"
      />
    </template>
    <template #detail>
      <p v-if="q.status.value === 'ready' && !q.selectedCard.value" class="msg--muted">
        Selecciona una tarjeta para ver su detalle y movimientos.
      </p>
      <template v-if="q.selectedCard.value">
        <CardDetailPanel :card="q.selectedCard.value" />
        <section class="panel" aria-label="Movimientos de la tarjeta">
          <DateRangeFilter @apply="q.applyFilter($event)" />
          <MovementsTable
            :movements="q.movements.value"
            :status="q.movementsStatus.value"
            :error-message="q.movementsError.value"
          />
        </section>
      </template>
    </template>
  </ConsultaLayout>
</template>
