import { describe, expect, it } from 'vitest';
import { createMockTaskRepository } from '../src/adapters/mockTaskRepository.js';
import { readEnv } from '../src/config/env.js';
import { useTasks } from '../src/features/tasks/useTasks.js';

const seed = [
  { id: 'a', title: 'Uno', done: false },
  { id: 'b', title: 'Dos', done: true },
];

describe('useTasks', () => {
  it('given a repository, when loaded, then tasks and counter are set', async () => {
    const t = useTasks(createMockTaskRepository(seed));
    await t.load();
    expect(t.tasks.value).toHaveLength(2);
    expect(t.counts.value).toEqual({ total: 2, done: 1, pending: 1 });
  });

  it('given a valid title, when added, then pending count increases', async () => {
    const t = useTasks(createMockTaskRepository(seed));
    await t.load();
    const res = await t.add('  Tres ');
    expect(res.ok).toBe(true);
    expect(t.tasks.value.at(-1).title).toBe('Tres');
    expect(t.counts.value.pending).toBe(2);
  });

  it('given an empty title, when added, then it is rejected and nothing changes', async () => {
    const t = useTasks(createMockTaskRepository(seed));
    await t.load();
    const res = await t.add('   ');
    expect(res.ok).toBe(false);
    expect(t.tasks.value).toHaveLength(2);
  });

  it('given a task, when toggled, then done count changes', async () => {
    const t = useTasks(createMockTaskRepository(seed));
    await t.load();
    await t.toggle('a');
    expect(t.counts.value.done).toBe(2);
    await t.toggle('a');
    expect(t.counts.value.done).toBe(1);
  });

  it('given a task, when removed, then total decreases', async () => {
    const t = useTasks(createMockTaskRepository(seed));
    await t.load();
    await t.remove('a');
    expect(t.counts.value.total).toBe(1);
  });

  it('given a failing repository, when loading, then error is exposed', async () => {
    const repo = createMockTaskRepository(seed);
    repo.list = async () => {
      throw new Error('boom');
    };
    const t = useTasks(repo);
    await t.load();
    expect(t.error.value).toBe('boom');
    expect(t.loading.value).toBe(false);
  });

  it('given an invalid repository, when creating the composable, then it throws', () => {
    expect(() => useTasks({})).toThrow(/Repositorio inválido/);
  });
});

describe('readEnv', () => {
  it('given no variables, when read, then defaults to mock', () => {
    expect(readEnv({})).toEqual({ dataMode: 'mock', apiBaseUrl: '' });
  });

  it('given http without base url, when read, then it throws', () => {
    expect(() => readEnv({ VITE_DATA_MODE: 'http' })).toThrow();
  });

  it('given an unknown mode, when read, then it throws', () => {
    expect(() => readEnv({ VITE_DATA_MODE: 'x' })).toThrow();
  });
});
