<script setup lang="ts">
import { useCounter } from '../composables/useCounter'
import type { CounterConfig } from '../domain/counter'

const props = defineProps<{ config?: Partial<CounterConfig> }>()
const { count, config, canIncrement, canDecrement, increment, decrement, reset } =
  useCounter(props.config)
</script>

<template>
  <section class="counter" aria-labelledby="counter-title">
    <h1 id="counter-title">Contador</h1>
    <p class="value" role="status" aria-live="polite" data-testid="value">{{ count }}</p>
    <p class="hint">Rango: {{ config.min }} a {{ config.max }} · paso {{ config.step }}</p>
    <div class="actions">
      <button type="button" data-testid="dec" :disabled="!canDecrement" @click="decrement">
        Decrementar
      </button>
      <button type="button" data-testid="inc" :disabled="!canIncrement" @click="increment">
        Incrementar
      </button>
      <button type="button" data-testid="reset" class="secondary" @click="reset">
        Reiniciar
      </button>
    </div>
  </section>
</template>

<style scoped>
.counter {
  --fg: #1a1a2e;
  --accent: #3b3bbf;
  max-width: 24rem;
  margin: 3rem auto;
  padding: 1.5rem;
  border: 1px solid #c8c8d8;
  border-radius: 0.75rem;
  text-align: center;
  color: var(--fg);
  font-family: system-ui, sans-serif;
}
.value {
  font-size: 3rem;
  margin: 0.5rem 0;
  font-weight: 700;
}
.hint {
  margin: 0 0 1rem;
  color: #4a4a60;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}
button {
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--accent);
  border-radius: 0.5rem;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
}
button.secondary {
  background: #fff;
  color: var(--accent);
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
button:focus-visible {
  outline: 3px solid #ffb000;
  outline-offset: 2px;
}
</style>
