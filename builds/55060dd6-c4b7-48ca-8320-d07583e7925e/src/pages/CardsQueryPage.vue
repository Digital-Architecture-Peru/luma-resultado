<script setup lang="ts">
import { onMounted } from 'vue'
import { useCards } from '../composables/useCards'
import { createCardQueryPort } from '../services'
import CardsLayout from '../components/templates/CardsLayout.vue'
import CardList from '../components/organisms/CardList.vue'
import CardDetailPanel from '../components/organisms/CardDetailPanel.vue'

const props = defineProps<{ port?: ReturnType<typeof createCardQueryPort> }>()
const { cards, selected, loading, detailLoading, error, empty, loadCards, selectCard } = useCards(
  props.port ?? createCardQueryPort()
)

onMounted(loadCards)
</script>

<template>
  <CardsLayout>
    <template #list>
      <p v-if="loading">Cargando tarjetas…</p>
      <p v-else-if="empty">No tienes tarjetas para mostrar.</p>
      <CardList v-else :cards="cards" :selected-id="selected?.id" @select="selectCard" />
    </template>
    <template #detail>
      <p v-if="detailLoading">Cargando detalle…</p>
      <CardDetailPanel v-else-if="selected" :card="selected" />
      <p v-else-if="!loading && cards.length">Selecciona una tarjeta para ver su detalle.</p>
    </template>
    <template #status>
      <span v-if="error" class="error">No se pudo completar la consulta: {{ error }}</span>
    </template>
  </CardsLayout>
</template>

<style scoped>
.error { color: #991b1b; font-weight: 600; }
</style>
