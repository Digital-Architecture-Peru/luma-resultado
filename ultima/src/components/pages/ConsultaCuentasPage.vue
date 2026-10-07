<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { useAccounts } from '../../composables/useAccounts';
import { AccountRepositoryKey } from '../../ports/keys';
import AccountTypeFilter from '../molecules/AccountTypeFilter.vue';
import StatusMessage from '../molecules/StatusMessage.vue';
import AccountDetailPanel from '../organisms/AccountDetailPanel.vue';
import AccountList from '../organisms/AccountList.vue';
import ConsultaLayout from '../templates/ConsultaLayout.vue';

const repository = inject(AccountRepositoryKey);
if (!repository) {
  throw new Error('AccountRepository no provisto: use provide(AccountRepositoryKey, ...).');
}

const {
  accounts,
  status,
  errorMessage,
  filter,
  selectedId,
  detail,
  detailLoading,
  detailError,
  load,
  setFilter,
  select,
  clearSelection,
} = useAccounts(repository);

onMounted(load);
</script>

<template>
  <ConsultaLayout
    title="Consulta de cuentas"
    subtitle="Revise el saldo y el estado de sus cuentas. Solo lectura."
  >
    <template #filters>
      <AccountTypeFilter :model-value="filter" @update:model-value="setFilter" />
    </template>

    <template #list>
      <StatusMessage v-if="status === 'loading' || status === 'idle'" kind="loading" message="Cargando cuentas…" />
      <StatusMessage v-else-if="status === 'error'" kind="error" :message="errorMessage ?? ''" @retry="load" />
      <StatusMessage v-else-if="status === 'empty'" kind="empty" message="No se encontraron cuentas para el filtro seleccionado." />
      <template v-else>
        <p class="count" role="status">{{ accounts.length }} cuenta(s) encontrada(s)</p>
        <AccountList :accounts="accounts" :selected-id="selectedId" @select="select" />
      </template>
    </template>

    <template #detail>
      <AccountDetailPanel
        :account="detail"
        :loading="detailLoading"
        :error="detailError"
        @close="clearSelection"
      />
    </template>
  </ConsultaLayout>
</template>

<style scoped>
.count {
  margin: 0 0 var(--space-3);
  color: var(--color-muted);
}
</style>
