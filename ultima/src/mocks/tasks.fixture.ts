import type { Task } from '../features/tasks/domain/task'

export const tasksFixture: Task[] = [
  { id: 't-1', title: 'Revisar correo (ejemplo)', done: true, createdAt: '2026-01-05T09:00:00.000Z' },
  { id: 't-2', title: 'Preparar presentación (ejemplo)', done: false, createdAt: '2026-01-05T09:10:00.000Z' },
  { id: 't-3', title: 'Comprar café (ejemplo)', done: false, createdAt: '2026-01-05T09:20:00.000Z' },
]
