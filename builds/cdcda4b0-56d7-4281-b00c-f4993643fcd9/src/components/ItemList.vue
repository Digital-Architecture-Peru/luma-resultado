<script setup lang="ts">
import type { Item } from '../domain/item'

defineProps<{ items: Item[]; loading: boolean }>()
</script>

<template>
  <p v-if="loading" role="status">Cargando…</p>
  <p v-else-if="items.length === 0" data-testid="empty">No hay items todavía.</p>
  <ul v-else class="list" aria-label="Lista de items">
    <li v-for="item in items" :key="item.id" class="card">
      <strong>{{ item.name }}</strong>
      <span>{{ item.description }}</span>
    </li>
  </ul>
</template>
