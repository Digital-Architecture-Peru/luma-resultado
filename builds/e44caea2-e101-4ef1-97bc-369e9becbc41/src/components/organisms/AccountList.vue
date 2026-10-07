<script setup lang="ts">
import type { Account } from '../../domain/account';
import AccountCard from '../molecules/AccountCard.vue';

defineProps<{ accounts: readonly Account[]; selectedId: string | null }>();
const emit = defineEmits<{ (e: 'select', id: string): void }>();
</script>

<template>
  <ul class="list" aria-label="Listado de cuentas">
    <li v-for="account in accounts" :key="account.id" class="list__item">
      <AccountCard
        :account="account"
        :selected="account.id === selectedId"
        @select="emit('select', $event)"
      />
    </li>
  </ul>
</template>

<style scoped>
.list {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
