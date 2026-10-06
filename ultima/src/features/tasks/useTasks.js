import { computed, ref } from 'vue';
import { assertRepository } from '../../ports/taskRepository.js';
import { countTasks, formatCounter, validateTitle } from './taskModel.js';

/**
 * Composable de estado de tareas.
 * @param {import('../../ports/taskRepository.js').TaskRepository} repository
 */
export function useTasks(repository) {
  const repo = assertRepository(repository);
  const tasks = ref([]);
  const loading = ref(false);
  const error = ref('');

  const counts = computed(() => countTasks(tasks.value));
  const counterText = computed(() => formatCounter(counts.value));

  async function run(action) {
    error.value = '';
    try {
      return await action();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error inesperado';
      return undefined;
    }
  }

  async function load() {
    loading.value = true;
    const result = await run(() => repo.list());
    if (result) tasks.value = result;
    loading.value = false;
  }

  /** @returns {Promise<{ ok: boolean, error: string }>} */
  async function add(title) {
    const check = validateTitle(title);
    if (!check.valid) return { ok: false, error: check.error };
    const created = await run(() => repo.create(check.value));
    if (!created) return { ok: false, error: error.value };
    tasks.value = [...tasks.value, created];
    return { ok: true, error: '' };
  }

  async function toggle(id) {
    const updated = await run(() => repo.toggle(id));
    if (updated) {
      tasks.value = tasks.value.map((t) => (t.id === id ? updated : t));
    }
  }

  async function remove(id) {
    const done = await run(async () => {
      await repo.remove(id);
      return true;
    });
    if (done) tasks.value = tasks.value.filter((t) => t.id !== id);
  }

  return { tasks, loading, error, counts, counterText, load, add, toggle, remove };
}
