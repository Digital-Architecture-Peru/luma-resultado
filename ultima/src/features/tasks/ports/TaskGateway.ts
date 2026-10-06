import type { Task } from '../domain/task'

export interface TaskGateway {
  list(): Promise<Task[]>
  create(title: string): Promise<Task>
  toggle(id: string): Promise<Task>
  remove(id: string): Promise<void>
}
