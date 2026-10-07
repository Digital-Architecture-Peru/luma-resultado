<script setup lang="ts">
import { onMounted } from 'vue'
import type { CardsGateway } from '../services/cards-gateway'
import { MockCardsGateway } from '../services/mock-cards-gateway'
import { useCardsQuery } from '../composables/useCardsQuery'
import CardsConsultTemplate from '../components/templates/CardsConsultTemplate.vue'
import CardList from '../components/organisms/CardList.vue'
import CardDetail from '../components/organisms/CardDetail.vue'
import MovementTable from '../components/organisms/MovementTable.vue'

const props = defineProps<{ gateway?: CardsGateway }>()
const { cards, movements, selectedId, selectedCard, loading, error, load, select } =
  useCardsQuery(props.gateway ?? new MockCardsGateway())

onMounted(load)
</script>

<template>
  <CardsConsultTemplate>
    <template #status>
      <span v-if="loading">Cargando…</span>
      <span v-else-if="error" class="error">
        {{ error }}
        <button type="button" @click="load">Reintentar</button>
      </span>
    </template>
    <template #list>
      <CardList :cards="cards" :selected-id="selectedId" @select="select" />
    </template>
    <template #detail>
      <CardDetail v-if="selectedCard" :card="selectedCard" />
    </template>
    <template #movements>
      <MovementTable v-if="selectedCard" :movements="movements" />
    </template>
  </CardsConsultTemplate>
</template>

<style scoped>
.error { color: #8a1c1c; }
button { margin-left: 0.5rem; }
</style>
