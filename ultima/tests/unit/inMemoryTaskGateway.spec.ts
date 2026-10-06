import { describe, expect, it } from 'vitest'
import { createInMemoryTaskGateway } from '../../src/features/tasks/adapters/inMemoryTaskGateway'
import { tasksFixture } from '../../src/mocks/tasks.fixture'

describe('inMemoryTaskGateway', () => {
  it('given seed when listing then returns copies of seed', async () => {
    const gw = createInMemoryTaskGateway(tasksFixture)
    const list = await gw.list()
    expect(list).toHaveLength(3)
    list[0].title = 'mutado'
    expect((await gw.list())[0].title).not.toBe('mutado')
  })
  it('given valid title when creating then task is pending and listed', async () => {
    const gw = createInMemoryTaskGateway()
    const t = await gw.create('  Nueva ')
    expect(t).toMatchObject({ title: 'Nueva', done: false })
    expect(await gw.list()).toHaveLength(1)
  })
  it('given blank title when creating then rejects', async () => {
    await expect(createInMemoryTaskGateway().create(' ')).rejects.toThrow()
  })
  it('given task when toggling twice then returns to pending', async () => {
    const gw = createInMemoryTaskGateway(tasksFixture)
    expect((await gw.toggle('t-2')).done).toBe(true)
    expect((await gw.toggle('t-2')).done).toBe(false)
  })
  it('given unknown id when toggling or removing then rejects', async () => {
    const gw = createInMemoryTaskGateway()
    await expect(gw.toggle('x')).rejects.toThrow()
    await expect(gw.remove('x')).rejects.toThrow()
  })
  it('given task when removing then it is gone', async () => {
    const gw = createInMemoryTaskGateway(tasksFixture)
    await gw.remove('t-1')
    expect((await gw.list()).map((t) => t.id)).toEqual(['t-2', 't-3'])
  })
})
