<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>();
</script>

<template>
  <main class="layout">
    <header class="layout__header">
      <h1 class="layout__title">{{ title }}</h1>
      <p v-if="subtitle" class="layout__subtitle">{{ subtitle }}</p>
    </header>
    <div class="layout__filters"><slot name="filters" /></div>
    <div class="layout__body">
      <section class="layout__list" aria-label="Cuentas"><slot name="list" /></section>
      <aside class="layout__detail" aria-label="Detalle"><slot name="detail" /></aside>
    </div>
  </main>
</template>

<style scoped>
.layout {
  max-width: 72rem;
  margin: 0 auto;
  padding: var(--space-4);
}
.layout__title {
  margin: 0;
  font-size: 1.5rem;
}
.layout__subtitle {
  margin: var(--space-1) 0 0;
  color: var(--color-muted);
}
.layout__filters {
  margin: var(--space-4) 0;
}
.layout__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
  align-items: start;
}
@media (min-width: 860px) {
  .layout__body {
    grid-template-columns: 3fr 2fr;
  }
}
</style>
