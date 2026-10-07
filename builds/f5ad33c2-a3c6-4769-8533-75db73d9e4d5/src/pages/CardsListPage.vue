<script setup lang="ts">
import { inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCards } from '../composables/useCards'
import { cardsGatewayKey, createGatewayFromEnv } from '../services/gatewayFactory'
import ConsultaLayout from '../components/templates/ConsultaLayout.vue'
import BaseSpinner from '../components/atoms/BaseSpinner.vue'
import CardList from '../components/organisms/CardList.vue'
import ErrorState from '../components/organisms/ErrorState.vue'

const router = useRouter()
const { cards, loading, error, load } = useCards(inject(cardsGatewayKey, null) ?? createGatewayFromEnv())

onMounted(load)
function open(id: string) {
  router.push({ name: 'card-detail', params: { id } })
}
</script>

<template>
  <ConsultaLayout title="Mis tarjetas">
    <BaseSpinner v-if="loading" label="Cargando tarjetas…" />
    <ErrorState v-else-if="error" :message="error" @retry="load" />
    <CardList v-else :cards="cards" @select="open" />
  </ConsultaLayout>
</template>
