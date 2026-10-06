import { describe, it, expect } from 'vitest'
import { useItems } from '../src/composables/useItems'
import { MockItemGateway } from '../src/adapters/mockItemGateway'
import type { ItemGateway } from '../src/ports/ItemGateway'

describe('useItems', () => {
  it('given gateway with fixtures when load then items populated', async () => {
    const { items, load, loading } = useItems(new MockItemGateway())
    await load()
    expect(items.value.length).toBeGreaterThan(0)
    expect(loading.value).toBe(false)
  })

  it('given valid input when add then item appended', async () => {
    const { items, load, add } = useItems(new MockItemGateway([]))
    await load()
    expect(await add({ name: 'X', description: '' })).toBe(true)
    expect(items.value).toHaveLength(1)
  })

  it('given invalid input when add then false and error set', async () => {
    const { add, error } = useItems(new MockItemGateway([]))
    expect(await add({ name: '', description: '' })).toBe(false)
    expect(error.value).not.toBeNull()
  })

  it('given failing gateway when load then error set', async () => {
    const failing: ItemGateway = {
      list: async () => { throw new Error('boom') },
      get: async () => undefined,
      create: async () => { throw new Error('boom') }
    }
    const { load, error } = useItems(failing)
    await load()
    expect(error.value).toBe('No se pudo cargar la lista.')
  })
})
