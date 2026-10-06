import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemList from '../src/components/ItemList.vue'
import ItemForm from '../src/components/ItemForm.vue'

describe('ItemList', () => {
  it('given no items when rendered then shows empty state', () => {
    const w = mount(ItemList, { props: { items: [], loading: false } })
    expect(w.find('[data-testid="empty"]').exists()).toBe(true)
  })
  it('given items when rendered then one card each', () => {
    const items = [{ id: '1', name: 'A', description: 'd', createdAt: '' }]
    const w = mount(ItemList, { props: { items, loading: false } })
    expect(w.findAll('li')).toHaveLength(1)
    expect(w.text()).toContain('A')
  })
  it('given loading when rendered then status shown', () => {
    const w = mount(ItemList, { props: { items: [], loading: true } })
    expect(w.find('[role="status"]').exists()).toBe(true)
  })
})

describe('ItemForm', () => {
  it('given empty name when submit then alert and no emit', async () => {
    const w = mount(ItemForm)
    await w.find('form').trigger('submit')
    expect(w.find('[role="alert"]').exists()).toBe(true)
    expect(w.emitted('submit')).toBeUndefined()
  })
  it('given valid name when submit then emits value', async () => {
    const w = mount(ItemForm)
    await w.find('#item-name').setValue('Nuevo')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0]).toEqual([{ name: 'Nuevo', description: '' }])
  })
})
