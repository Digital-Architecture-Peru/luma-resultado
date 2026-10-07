<template>
  <div class="layout">
    <header><h1><slot name="title">Consulta de tarjetas</slot></h1></header>
    <div class="status" role="status" aria-live="polite"><slot name="status" /></div>
    <div class="body">
      <aside><slot name="list" /></aside>
      <main>
        <slot name="detail" />
        <slot name="movements" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout { max-width: 960px; margin: 0 auto; padding: 1rem; }
.body { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 720px) {
  .body { grid-template-columns: 280px 1fr; }
}
main { display: grid; gap: 1.5rem; align-content: start; }
</style>
