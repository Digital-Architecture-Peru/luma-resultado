import type { Task } from '../domain/task'
import { validateTitle } from '../domain/task'
import type { TaskGateway } from '../ports/TaskGateway'

export function createInMemoryTaskGateway(seed: readonly Task[] = []): TaskGateway {
  let items: Task[] = seed.map((t) => ({ ...t }))
  let sequence = items.length

  return {
    async list() {
      return items.map((t) => ({ ...t }))
    },
    async create(title) {
      const checked = validateTitle(title)
      if (!checked.ok) throw new Error(checked.error)
      sequence += 1
      const task: Task = {
        id: `mem-${sequence}`,
        title: checked.value,
        done: false,
        createdAt: new Date().toISOString(),
      }
      items = [...items, task]
      return { ...task }
    },
    async toggle(id) {
      const found = items.find((t) => t.id === id)
      if (!found) throw new Error('Tarea no encontrada.')
      const updated: Task = { ...found, done: !found.done }
      items = items.map((t) => (t.id === id ? updated : t))
      return { ...updated }
    },
    async remove(id) {
      if (!items.some((t) => t.id === id)) throw new Error('Tarea no encontrada.')
      items = items.filter((t) => t.id !== id)
    },
  }
}
