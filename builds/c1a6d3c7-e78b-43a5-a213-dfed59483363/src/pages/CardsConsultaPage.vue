<script setup lang="ts">
import { onMounted } from 'vue'
import type { CardsRepository } from '../data/CardsRepository'
import { InMemoryCardsRepository } from '../data/inMemoryCardsRepository'
import { useCards } from '../composables/useCards'
import ConsultaLayout from '../components/templates/ConsultaLayout.vue'
import CardList from '../components/organisms/CardList.vue'
import CardDetailPanel from '../components/organisms/CardDetailPanel.vue'
import StatusMessage from '../components/molecules/StatusMessage.vue'

const props = defineProps<{ repository?: CardsRepository }>()
const { status, cards, selectedId, selected, errorMessage, load, select } = useCards(
  props.repository ?? new InMemoryCardsRepository()
)
onMounted(load)
</script>

<template>
  <ConsultaLayout title="Consulta de tarjetas">
    <template #list>
      <StatusMessage v-if="status === 'loading' || status === 'idle'" kind="loading" message="Cargando tus tarjetas…" />
      <StatusMessage v-else-if="status === 'empty'" kind="empty" message="No tienes tarjetas para mostrar." />
      <StatusMessage v-else-if="status === 'error'" kind="error" :message="errorMessage" @retry="load" />
      <CardList v-else :cards="cards" :selected-id="selectedId" @select="select" />
    </template>
    <template #detail>
      <CardDetailPanel v-if="selected" :card="selected" />
    </template>
  </ConsultaLayout>
</template>
