export interface CounterConfig {
  initial: number
  step: number
  min: number
  max: number
}

export const DEFAULT_CONFIG: CounterConfig = {
  initial: 0,
  step: 1,
  min: -100,
  max: 100
}

/** Convierte texto de entorno a entero; devuelve el fallback si no es válido. */
export function parseIntOr(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === '') return fallback
  const n = Number(value)
  return Number.isInteger(n) ? n : fallback
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function buildConfig(partial: Partial<CounterConfig> = {}): CounterConfig {
  const cfg = { ...DEFAULT_CONFIG, ...partial }
  if (cfg.step <= 0) cfg.step = DEFAULT_CONFIG.step
  if (cfg.min > cfg.max) {
    throw new Error('min no puede ser mayor que max')
  }
  cfg.initial = clamp(cfg.initial, cfg.min, cfg.max)
  return cfg
}

export function increment(value: number, cfg: CounterConfig): number {
  return clamp(value + cfg.step, cfg.min, cfg.max)
}

export function decrement(value: number, cfg: CounterConfig): number {
  return clamp(value - cfg.step, cfg.min, cfg.max)
}
