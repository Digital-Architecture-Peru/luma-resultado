/**
 * Contrato del repositorio de tareas (puerto).
 *
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {boolean} done
 *
 * @typedef {Object} TaskRepository
 * @property {() => Promise<Task[]>} list
 * @property {(title: string) => Promise<Task>} create
 * @property {(id: string) => Promise<Task>} toggle
 * @property {(id: string) => Promise<void>} remove
 */

export const REPOSITORY_METHODS = ['list', 'create', 'toggle', 'remove'];

/**
 * Comprueba que un objeto cumple el contrato.
 * @param {any} repo
 * @returns {TaskRepository}
 */
export function assertRepository(repo) {
  for (const m of REPOSITORY_METHODS) {
    if (!repo || typeof repo[m] !== 'function') {
      throw new Error(`Repositorio inválido: falta el método ${m}`);
    }
  }
  return repo;
}
