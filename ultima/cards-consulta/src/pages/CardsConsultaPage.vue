<script setup lang="ts">
import { onMounted } from 'vue';
import { useCards } from '../composables/useCards';
import { createRepository } from '../services/repositoryFactory';
import type { CardsRepository } from '../services/CardsRepository';
import ConsultaLayout from '../components/templates/ConsultaLayout.vue';
import CardList from '../components/organisms/CardList.vue';
import CardDetailPanel from '../components/organisms/CardDetailPanel.vue';

const props = defineProps<{ repository?: CardsRepository }>();
const { cards, selected, selectedId, state, error, load, select } = useCards(
  props.repository ?? createRepository(),
);

onMounted(load);
</script>

<template>
  <ConsultaLayout>
    <template #status>
      <span v-if="state === 'loading'">Cargando tarjetas…</span>
      <span v-else-if="state === 'error'">
        No se pudieron cargar las tarjetas: {{ error }}
        <button type="button" @click="load">Reintentar</button>
      </span>
      <span v-else-if="state === 'empty'">No tienes tarjetas para mostrar.</span>
    </template>
    <template #list>
      <CardList v-if="state === 'data'" :cards="cards" :selected-id="selectedId" @select="select" />
    </template>
    <template #detail>
      <CardDetailPanel v-if="state === 'data'" :card="selected" />
    </template>
  </ConsultaLayout>
</template>
