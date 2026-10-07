<template>
  <div class="layout">
    <header><h1><slot name="title">Mis tarjetas</slot></h1></header>
    <div class="layout__body">
      <nav class="layout__list" aria-label="Listado de tarjetas"><slot name="list" /></nav>
      <main class="layout__detail"><slot name="detail" /></main>
    </div>
    <div class="layout__status" role="status" aria-live="polite"><slot name="status" /></div>
  </div>
</template>

<style scoped>
.layout { max-width: 960px; margin: 0 auto; padding: 1rem; font-family: system-ui, sans-serif; color: #111827; }
.layout__body { display: grid; gap: 1rem; grid-template-columns: 1fr; }
@media (min-width: 720px) { .layout__body { grid-template-columns: 1fr 2fr; } }
.layout__status { margin-top: 1rem; min-height: 1.5rem; }
</style>
