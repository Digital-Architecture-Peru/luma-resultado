<script setup lang="ts">
import { onMounted } from 'vue'
import ItemList from './components/ItemList.vue'
import ItemForm from './components/ItemForm.vue'
import { useItems } from './composables/useItems'
import { createGateway } from './adapters/factory'
import type { NewItem } from './domain/item'

const { items, loading, error, load, add } = useItems(createGateway(import.meta.env))

onMounted(load)

async function onSubmit(value: NewItem) {
  await add(value)
}
</script>

<template>
  <main class="container">
    <h1>Gestor de items</h1>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <section aria-labelledby="new-title">
      <h2 id="new-title">Nuevo item</h2>
      <ItemForm @submit="onSubmit" />
    </section>
    <section aria-labelledby="list-title">
      <h2 id="list-title">Items</h2>
      <ItemList :items="items" :loading="loading" />
    </section>
  </main>
</template>

<style>
:root {
  --bg: #f6f7f9;
  --fg: #1b1f24;
  --accent: #0b5cad;
  --danger: #b00020;
  --radius: 8px;
  --gap: 1rem;
}
body { margin: 0; background: var(--bg); color: var(--fg); font-family: system-ui, sans-serif; }
.container { max-width: 40rem; margin: 0 auto; padding: var(--gap); }
.field { display: flex; flex-direction: column; margin-bottom: var(--gap); }
input, textarea { padding: 0.5rem; border: 1px solid #667; border-radius: var(--radius); font: inherit; }
button { background: var(--accent); color: #fff; border: 0; border-radius: var(--radius); padding: 0.6rem 1.2rem; cursor: pointer; }
:focus-visible { outline: 3px solid #f5a623; outline-offset: 2px; }
.list { list-style: none; padding: 0; display: grid; gap: var(--gap); }
.card { background: #fff; border-radius: var(--radius); padding: var(--gap); display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,.15); }
.error { color: var(--danger); margin: 0.25rem 0; }
</style>
