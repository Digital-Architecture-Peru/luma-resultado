import { describe, it, expect } from 'vitest'
import { validateItem, NAME_MAX, DESCRIPTION_MAX } from '../src/domain/item'
import { MockItemGateway } from '../src/adapters/mockItemGateway'

describe('validateItem', () => {
  it('given empty name when validating then name error', () => {
    expect(validateItem({ name: '   ', description: '' }).name).toBeDefined()
  })
  it('given valid input when validating then no errors', () => {
    expect(validateItem({ name: 'Ok', description: 'x' })).toEqual({})
  })
  it('given too long name when validating then name error', () => {
    expect(validateItem({ name: 'a'.repeat(NAME_MAX + 1), description: '' }).name).toBeDefined()
  })
  it('given too long description when validating then description error', () => {
    expect(validateItem({ name: 'a', description: 'b'.repeat(DESCRIPTION_MAX + 1) }).description).toBeDefined()
  })
})

describe('MockItemGateway', () => {
  it('given valid input when create then item is listed with trimmed name', async () => {
    const gw = new MockItemGateway([])
    const created = await gw.create({ name: '  Nuevo ', description: '' })
    expect(created.name).toBe('Nuevo')
    expect(await gw.list()).toHaveLength(1)
    expect(await gw.get(created.id)).toBeDefined()
  })
  it('given invalid input when create then rejects', async () => {
    const gw = new MockItemGateway([])
    await expect(gw.create({ name: '', description: '' })).rejects.toThrow()
  })
  it('given unknown id when get then undefined', async () => {
    expect(await new MockItemGateway([]).get('zzz')).toBeUndefined()
  })
})
