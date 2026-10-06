import type { Item, NewItem } from '../domain/item'
import type { ItemGateway } from '../ports/ItemGateway'

/**
 * Candidate: contrato REST JSON hipotético (sin probar contra backend real).
 *   GET  {base}/items       -> Item[]
 *   GET  {base}/items/{id}  -> Item | 404
 *   POST {base}/items       -> Item (201)
 */
export class HttpItemGateway implements ItemGateway {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchFn: typeof fetch = (...args) => fetch(...args)
  ) {}

  private async request<T>(path: string, init?: RequestInit): Promise<Response> {
    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    })
    return res as Response
  }

  async list(): Promise<Item[]> {
    const res = await this.request<Item[]>('/items')
    if (!res.ok) throw new Error(`Error al listar (${res.status})`)
    return (await res.json()) as Item[]
  }

  async get(id: string): Promise<Item | undefined> {
    const res = await this.request<Item>(`/items/${encodeURIComponent(id)}`)
    if (res.status === 404) return undefined
    if (!res.ok) throw new Error(`Error al obtener (${res.status})`)
    return (await res.json()) as Item
  }

  async create(input: NewItem): Promise<Item> {
    const res = await this.request<Item>('/items', { method: 'POST', body: JSON.stringify(input) })
    if (!res.ok) throw new Error(`Error al crear (${res.status})`)
    return (await res.json()) as Item
  }
}
