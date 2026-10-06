import { sampleTasks } from '../fixtures/tasks.js';

/**
 * Repositorio en memoria (datos ficticios, sin red).
 * @param {import('../ports/taskRepository.js').Task[]} seed
 * @returns {import('../ports/taskRepository.js').TaskRepository}
 */
export function createMockTaskRepository(seed = sampleTasks) {
  let items = seed.map((t) => ({ ...t }));
  let nextId = items.length + 1;

  const find = (id) => {
    const item = items.find((t) => t.id === id);
    if (!item) throw new Error(`Tarea no encontrada: ${id}`);
    return item;
  };

  return {
    async list() {
      return items.map((t) => ({ ...t }));
    },
    async create(title) {
      const task = { id: `t-${nextId++}`, title, done: false };
      items.push(task);
      return { ...task };
    },
    async toggle(id) {
      const item = find(id);
      item.done = !item.done;
      return { ...item };
    },
    async remove(id) {
      find(id);
      items = items.filter((t) => t.id !== id);
    },
  };
}
