<template>
  <main class="layout">
    <header><h1>Mis tarjetas</h1></header>
    <div class="status" role="status" aria-live="polite"><slot name="status" /></div>
    <div class="grid">
      <div><slot name="list" /></div>
      <div><slot name="detail" /></div>
    </div>
  </main>
</template>

<style scoped>
.layout { max-width: 960px; margin: 0 auto; padding: 1rem; color: #111827; font-family: system-ui, sans-serif; }
.grid { display: grid; gap: 1rem; grid-template-columns: 1fr; }
@media (min-width: 720px) {
  .grid { grid-template-columns: 1fr 1fr; }
}
</style>
