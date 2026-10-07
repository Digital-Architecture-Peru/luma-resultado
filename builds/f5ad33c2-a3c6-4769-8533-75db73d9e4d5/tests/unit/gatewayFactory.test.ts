import { describe, expect, it } from 'vitest'
import { createGateway } from '../../src/services/gatewayFactory'
import { MockCardsGateway } from '../../src/services/MockCardsGateway'
import { HttpCardsGateway } from '../../src/services/HttpCardsGateway'

describe('createGateway', () => {
  it('defaults to mock', () => {
    expect(createGateway()).toBeInstanceOf(MockCardsGateway)
    expect(createGateway({ adapter: '' })).toBeInstanceOf(MockCardsGateway)
  })
  it('returns http adapter when configured with base url', () => {
    expect(createGateway({ adapter: 'http', baseUrl: 'https://example.invalid' })).toBeInstanceOf(HttpCardsGateway)
  })
  it('throws when http has no base url', () => {
    expect(() => createGateway({ adapter: 'http' })).toThrow()
  })
  it('throws on unknown adapter', () => {
    expect(() => createGateway({ adapter: 'x' })).toThrow(/desconocido/)
  })
})

describe('MockCardsGateway', () => {
  it('lists summaries without sensitive extras and returns null for unknown id', async () => {
    const g = new MockCardsGateway()
    const list = await g.listCards()
    expect(list.length).toBeGreaterThan(0)
    expect(Object.keys(list[0])).not.toContain('holder')
    expect(await g.getCard('zzz')).toBeNull()
    expect(await g.getMovements('zzz')).toEqual([])
  })
})
