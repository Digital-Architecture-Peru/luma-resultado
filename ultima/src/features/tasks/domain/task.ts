export interface Task {
  id: string
  title: string
  done: boolean
  createdAt: string
}

export interface TaskCounts {
  total: number
  done: number
  pending: number
}

export const MAX_TITLE_LENGTH = 120

export type TitleValidation = { ok: true; value: string } | { ok: false; error: string }

export function validateTitle(raw: string): TitleValidation {
  const value = raw.trim().replace(/\s+/g, ' ')
  if (value.length === 0) return { ok: false, error: 'El título es obligatorio.' }
  if (value.length > MAX_TITLE_LENGTH) {
    return { ok: false, error: `El título no puede superar ${MAX_TITLE_LENGTH} caracteres.` }
  }
  return { ok: true, value }
}

export function countTasks(tasks: readonly Task[]): TaskCounts {
  const done = tasks.filter((t) => t.done).length
  return { total: tasks.length, done, pending: tasks.length - done }
}
