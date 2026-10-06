import { computed, ref } from 'vue'
import type { Task } from './domain/task'
import { countTasks } from './domain/task'
import type { TaskGateway } from './ports/TaskGateway'

export function useTasks(gateway: TaskGateway) {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const counts = computed(() => countTasks(tasks.value))

  async function run(action: () => Promise<void>): Promise<boolean> {
    error.value = null
    try {
      await action()
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error inesperado.'
      return false
    }
  }

  async function load() {
    loading.value = true
    await run(async () => {
      tasks.value = await gateway.list()
    })
    loading.value = false
  }

  const add = (title: string) =>
    run(async () => {
      const created = await gateway.create(title)
      tasks.value = [...tasks.value, created]
    })

  const toggle = (id: string) =>
    run(async () => {
      const updated = await gateway.toggle(id)
      tasks.value = tasks.value.map((t) => (t.id === id ? updated : t))
    })

  const remove = (id: string) =>
    run(async () => {
      await gateway.remove(id)
      tasks.value = tasks.value.filter((t) => t.id !== id)
    })

  return { tasks, loading, error, counts, load, add, toggle, remove }
}
