<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCards } from '../../composables/useCards';
import type { CardRepository } from '../../services/cardRepository';
import BaseButton from '../atoms/BaseButton.vue';
import CardFilter from '../molecules/CardFilter.vue';
import CardList from '../organisms/CardList.vue';

const props = defineProps<{ repository: CardRepository }>();
const { state, query, status, visibleCards, load } = useCards(props.repository);

// 'idle' es el instante previo a la primera carga: se muestra igual que 'loading'
// para que nunca haya un primer render sin indicador de estado.
const isLoading = computed(() => state.value === 'idle' || state.value === 'loading');

onMounted(load);
</script>

<template>
  <main class="page">
    <h1>Consulta de tarjetas</h1>
    <p v-if="isLoading" role="status">Cargando tarjetas…</p>
    <div v-else-if="state === 'error'" role="alert" class="error">
      <p>No se pudieron cargar tus tarjetas.</p>
      <BaseButton @click="load">Reintentar</BaseButton>
    </div>
    <template v-else-if="state === 'success'">
      <CardFilter v-model:query="query" v-model:status="status" />
      <p role="status" class="count">{{ visibleCards.length }} tarjeta(s) encontrada(s)</p>
      <CardList :cards="visibleCards" />
    </template>
  </main>
</template>
