import { describe, expect, it } from 'vitest'
import { MAX_TITLE_LENGTH, countTasks, validateTitle } from '../../src/features/tasks/domain/task'
import { tasksFixture } from '../../src/mocks/tasks.fixture'

describe('validateTitle', () => {
  it('given empty/blank title when validating then returns error', () => {
    expect(validateTitle('   ').ok).toBe(false)
  })
  it('given spaces around when validating then trims and collapses', () => {
    expect(validateTitle('  hola   mundo ')).toEqual({ ok: true, value: 'hola mundo' })
  })
  it('given too long title when validating then returns error', () => {
    expect(validateTitle('a'.repeat(MAX_TITLE_LENGTH + 1)).ok).toBe(false)
  })
})

describe('countTasks', () => {
  it('given fixture when counting then totals are consistent', () => {
    expect(countTasks(tasksFixture)).toEqual({ total: 3, done: 1, pending: 2 })
  })
  it('given no tasks when counting then all zero', () => {
    expect(countTasks([])).toEqual({ total: 0, done: 0, pending: 0 })
  })
})
