import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import App from '../../src/App.vue'
import TaskForm from '../../src/features/tasks/components/TaskForm.vue'

async function mountApp() {
  const wrapper = mount(App)
  await flushPromises()
  return wrapper
}

describe('TaskForm', () => {
  it('given blank input when submitting then shows error and emits nothing', async () => {
    const wrapper = mount(TaskForm)
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.find('[role="alert"]').text()).toContain('obligatorio')
  })
  it('given text when submitting then emits trimmed title and clears input', async () => {
    const wrapper = mount(TaskForm)
    const input = wrapper.find('input')
    await input.setValue('  Tarea  ')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')![0]).toEqual(['Tarea'])
    expect((input.element as HTMLInputElement).value).toBe('')
  })
})

describe('App', () => {
  it('given fixture when loaded then counter shows 2 pending of 3', async () => {
    const wrapper = await mountApp()
    expect(wrapper.find('[role="status"]').text()).toContain('2 pendientes de 3')
  })
  it('given app when adding a task then counter and list update', async () => {
    const wrapper = await mountApp()
    await wrapper.find('#new-task').setValue('Otra')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.find('[role="status"]').text()).toContain('3 pendientes de 4')
    expect(wrapper.findAll('li')).toHaveLength(4)
  })
  it('given pending task when checked then pending decreases', async () => {
    const wrapper = await mountApp()
    await wrapper.findAll('input[type="checkbox"]')[1].trigger('change')
    await flushPromises()
    expect(wrapper.find('[role="status"]').text()).toContain('1 pendientes de 3')
  })
  it('given task when deleting then total decreases', async () => {
    const wrapper = await mountApp()
    await wrapper.find('button.danger').trigger('click')
    await flushPromises()
    expect(wrapper.find('[role="status"]').text()).toContain('2 pendientes de 2')
  })
})
