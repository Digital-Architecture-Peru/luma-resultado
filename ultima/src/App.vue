<script setup lang="ts">
import { provide } from 'vue';
import { InMemoryAccountRepository } from './adapters/InMemoryAccountRepository';
import ConsultaCuentasPage from './components/pages/ConsultaCuentasPage.vue';
import { AccountRepositoryKey } from './ports/keys';

// Integracion "Ninguna": adaptador en memoria con datos ficticios y latencia simulada.
// Para integrar un backend, proveer aqui otro adaptador que implemente AccountRepository.
provide(AccountRepositoryKey, new InMemoryAccountRepository(undefined, 250));
</script>

<template>
  <ConsultaCuentasPage />
</template>
