/**
 * CANDIDATE: adaptador HTTP con contrato inventado (no hay backend definido).
 *   GET    {base}/tasks            -> Task[]
 *   POST   {base}/tasks            {title} -> Task
 *   PATCH  {base}/tasks/:id/toggle -> Task
 *   DELETE {base}/tasks/:id        -> 204
 * @param {string} baseUrl
 * @param {typeof fetch} fetchImpl
 * @returns {import('../ports/taskRepository.js').TaskRepository}
 */
export function createHttpTaskRepository(baseUrl, fetchImpl = (...a) => fetch(...a)) {
  async function request(path, options = {}) {
    const res = await fetchImpl(`${baseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}`);
    }
    return res.status === 204 ? undefined : res.json();
  }

  return {
    list: () => request('/tasks'),
    create: (title) => request('/tasks', { method: 'POST', body: JSON.stringify({ title }) }),
    toggle: (id) => request(`/tasks/${encodeURIComponent(id)}/toggle`, { method: 'PATCH' }),
    remove: (id) => request(`/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  };
}
