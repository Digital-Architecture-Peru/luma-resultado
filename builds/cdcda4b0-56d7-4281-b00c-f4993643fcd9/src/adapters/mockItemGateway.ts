import type { Item, NewItem } from '../domain/item'
import { normalizeItem, validateItem } from '../domain/item'
import type { ItemGateway } from '../ports/ItemGateway'
import { fixtureItems } from '../fixtures/items'

/** Persistencia en memoria con datos ficticios. */
export class MockItemGateway implements ItemGateway {
  private items: Item[]
  private seq: number

  constructor(seed: Item[] = fixtureItems) {
    this.items = seed.map((i) => ({ ...i }))
    this.seq = this.items.length + 1
  }

  async list(): Promise<Item[]> {
    return this.items.map((i) => ({ ...i }))
  }

  async get(id: string): Promise<Item | undefined> {
    const found = this.items.find((i) => i.id === id)
    return found ? { ...found } : undefined
  }

  async create(input: NewItem): Promise<Item> {
    if (Object.keys(validateItem(input)).length > 0) {
      throw new Error('Datos inválidos')
    }
    const clean = normalizeItem(input)
    const item: Item = {
      id: String(this.seq++),
      ...clean,
      createdAt: new Date().toISOString()
    }
    this.items.push(item)
    return { ...item }
  }
}
