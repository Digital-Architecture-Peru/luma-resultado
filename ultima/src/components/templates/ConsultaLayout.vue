<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="layout">
    <header class="layout__header"><h1>{{ title }}</h1></header>
    <main class="layout__main"><slot /></main>
  </div>
</template>
