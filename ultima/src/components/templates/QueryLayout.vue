<template>
  <main class="layout">
    <h1><slot name="title" /></h1>
    <slot name="status" />
    <div class="grid">
      <div><slot name="list" /></div>
      <div><slot name="detail" /></div>
    </div>
  </main>
</template>

<style scoped>
.layout { max-width: 64rem; margin: 0 auto; padding: var(--space-4) var(--space-3); }
.grid { display: grid; gap: var(--space-4); grid-template-columns: 1fr; }
@media (min-width: 768px) { .grid { grid-template-columns: 1fr 2fr; } }
</style>
