import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createMockTaskRepository } from '../src/adapters/mockTaskRepository.js';
import TaskListView from '../src/features/tasks/TaskListView.vue';

const seed = [
  { id: 'a', title: 'Uno', done: false },
  { id: 'b', title: 'Dos', done: true },
];

async function setup(items = seed) {
  const wrapper = mount(TaskListView, {
    props: { repository: createMockTaskRepository(items) },
  });
  await flushPromises();
  return wrapper;
}

describe('TaskListView', () => {
  it('given seeded tasks, when mounted, then it lists them with the counter', async () => {
    const w = await setup();
    expect(w.findAll('li')).toHaveLength(2);
    expect(w.get('[data-testid="counter"]').text()).toContain('1 pendiente');
  });

  it('given no tasks, when mounted, then shows the empty state', async () => {
    const w = await setup([]);
    expect(w.text()).toContain('No hay tareas');
    expect(w.get('[data-testid="counter"]').text()).toBe('Sin tareas');
  });

  it('given a new title, when the form is submitted, then the task and counter update', async () => {
    const w = await setup();
    await w.get('#new-task').setValue('Tres');
    await w.get('form').trigger('submit');
    await flushPromises();
    expect(w.findAll('li')).toHaveLength(3);
    expect(w.get('[data-testid="counter"]').text()).toContain('2 pendientes');
    expect(w.get('#new-task').element.value).toBe('');
  });

  it('given an empty title, when submitted, then shows a validation error', async () => {
    const w = await setup();
    await w.get('form').trigger('submit');
    await flushPromises();
    expect(w.get('#new-task-error').text()).toContain('obligatorio');
    expect(w.findAll('li')).toHaveLength(2);
  });

  it('given a pending task, when its checkbox is changed, then the counter updates', async () => {
    const w = await setup();
    await w.findAll('input[type="checkbox"]')[0].setValue(true);
    await flushPromises();
    expect(w.get('[data-testid="counter"]').text()).toContain('0 pendientes');
  });

  it('given a task, when Eliminar is clicked, then it disappears', async () => {
    const w = await setup();
    await w.findAll('li button')[0].trigger('click');
    await flushPromises();
    expect(w.findAll('li')).toHaveLength(1);
  });
});
