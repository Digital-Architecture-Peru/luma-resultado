<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <main class="layout">
    <h1>{{ title }}</h1>
    <div class="layout__grid">
      <aside class="layout__list"><slot name="list" /></aside>
      <div class="layout__detail"><slot name="detail" /></div>
    </div>
  </main>
</template>

<style scoped>
.layout { max-width: 960px; margin: 0 auto; padding: 16px; font-family: system-ui, sans-serif; color: #1b1f24; }
.layout__grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 720px) { .layout__grid { grid-template-columns: 320px 1fr; } }
</style>
