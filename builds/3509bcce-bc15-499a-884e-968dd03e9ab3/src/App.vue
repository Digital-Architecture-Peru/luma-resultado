<script setup lang="ts">
import CounterPanel from './components/CounterPanel.vue'
import { DEFAULT_CONFIG, parseIntOr } from './domain/counter'

const config = {
  initial: parseIntOr(import.meta.env.VITE_COUNTER_INITIAL, DEFAULT_CONFIG.initial),
  step: parseIntOr(import.meta.env.VITE_COUNTER_STEP, DEFAULT_CONFIG.step)
}
</script>

<template>
  <main>
    <CounterPanel :config="config" />
  </main>
</template>
