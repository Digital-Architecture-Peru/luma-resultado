import type { Item, NewItem } from '../domain/item'

export interface ItemGateway {
  list(): Promise<Item[]>
  get(id: string): Promise<Item | undefined>
  create(input: NewItem): Promise<Item>
}
