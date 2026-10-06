import { computed, ref } from 'vue'
import {
  buildConfig,
  decrement as dec,
  increment as inc,
  type CounterConfig
} from '../domain/counter'

export function useCounter(partial: Partial<CounterConfig> = {}) {
  const config = buildConfig(partial)
  const count = ref(config.initial)

  const canIncrement = computed(() => count.value < config.max)
  const canDecrement = computed(() => count.value > config.min)

  function increment(): void {
    count.value = inc(count.value, config)
  }
  function decrement(): void {
    count.value = dec(count.value, config)
  }
  function reset(): void {
    count.value = config.initial
  }

  return { count, config, canIncrement, canDecrement, increment, decrement, reset }
}
