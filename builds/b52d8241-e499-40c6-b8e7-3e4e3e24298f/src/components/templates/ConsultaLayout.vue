<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <main class="layout">
    <h1>{{ title }}</h1>
    <div class="layout__grid">
      <aside><slot name="list" /></aside>
      <div><slot name="detail" /></div>
    </div>
  </main>
</template>
