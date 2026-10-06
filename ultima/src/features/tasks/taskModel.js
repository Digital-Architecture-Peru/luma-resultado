export const MAX_TITLE_LENGTH = 120;

/**
 * Valida y normaliza el título de una tarea.
 * @param {unknown} input
 * @returns {{ valid: boolean, value: string, error: string }}
 */
export function validateTitle(input) {
  const value = typeof input === 'string' ? input.trim().replace(/\s+/g, ' ') : '';
  if (!value) {
    return { valid: false, value, error: 'El título es obligatorio.' };
  }
  if (value.length > MAX_TITLE_LENGTH) {
    return {
      valid: false,
      value,
      error: `El título no puede superar ${MAX_TITLE_LENGTH} caracteres.`,
    };
  }
  return { valid: true, value, error: '' };
}

/**
 * Cuenta tareas totales, completadas y pendientes.
 * @param {{ done: boolean }[]} tasks
 */
export function countTasks(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  return { total, done, pending: total - done };
}

/**
 * Texto del contador para lectores de pantalla y UI.
 * @param {{ total: number, done: number, pending: number }} counts
 */
export function formatCounter({ total, done, pending }) {
  if (total === 0) return 'Sin tareas';
  const p = pending === 1 ? '1 pendiente' : `${pending} pendientes`;
  const d = done === 1 ? '1 completada' : `${done} completadas`;
  return `${p} · ${d} · ${total} en total`;
}
