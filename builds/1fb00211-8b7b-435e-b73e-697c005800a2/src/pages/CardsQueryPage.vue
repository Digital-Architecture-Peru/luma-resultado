<script setup lang="ts">
import { inject, onMounted } from 'vue'
import { cardRepositoryKey } from '../composables/repositoryKey'
import { useCardQuery } from '../composables/useCardQuery'
import QueryLayout from '../components/templates/QueryLayout.vue'
import StatusMessage from '../components/molecules/StatusMessage.vue'
import CardList from '../components/organisms/CardList.vue'
import CardDetailPanel from '../components/organisms/CardDetailPanel.vue'

const repository = inject(cardRepositoryKey)
if (!repository) throw new Error('CardRepository no provisto')

const { state, cards, selectedId, selected, errorMessage, load, select } = useCardQuery(repository)

onMounted(load)
</script>

<template>
  <QueryLayout>
    <template #title>Consulta de tarjetas</template>
    <template #status>
      <StatusMessage v-if="state !== 'success'" :state="state" :message="errorMessage" @retry="load" />
    </template>
    <template #list>
      <CardList v-if="state === 'success'" :cards="cards" :selected-id="selectedId" @select="select" />
    </template>
    <template #detail>
      <CardDetailPanel v-if="state === 'success'" :card="selected" />
    </template>
  </QueryLayout>
</template>
