<script setup lang="ts">
import { computed, inject, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCardDetail } from '../composables/useCardDetail'
import { cardsGatewayKey, createGatewayFromEnv } from '../services/gatewayFactory'
import ConsultaLayout from '../components/templates/ConsultaLayout.vue'
import BaseSpinner from '../components/atoms/BaseSpinner.vue'
import CardDetailPanel from '../components/organisms/CardDetailPanel.vue'
import MovementList from '../components/organisms/MovementList.vue'
import ErrorState from '../components/organisms/ErrorState.vue'

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))
const { card, movements, loading, error, notFound, load } = useCardDetail(
  inject(cardsGatewayKey, null) ?? createGatewayFromEnv()
)

onMounted(() => load(id.value))
</script>

<template>
  <ConsultaLayout title="Detalle de tarjeta">
    <router-link to="/tarjetas">← Volver a mis tarjetas</router-link>
    <BaseSpinner v-if="loading" label="Cargando detalle…" />
    <ErrorState v-else-if="error" :message="error" @retry="load(id)" />
    <p v-else-if="notFound" class="empty" role="status">La tarjeta solicitada no existe.</p>
    <template v-else-if="card">
      <CardDetailPanel :card="card" />
      <MovementList :movements="movements" />
    </template>
  </ConsultaLayout>
</template>
