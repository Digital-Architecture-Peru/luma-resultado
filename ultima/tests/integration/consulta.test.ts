import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import App from '../../src/App.vue'
import { createAppRouter } from '../../src/router'
import { cardsGatewayKey } from '../../src/services/gatewayFactory'
import { MockCardsGateway } from '../../src/services/MockCardsGateway'
import type { CardsGateway } from '../../src/services/CardsGateway'

async function setup(path: string, gateway: CardsGateway = new MockCardsGateway()) {
  const router = createAppRouter(createMemoryHistory())
  router.push(path)
  await router.isReady()
  const w = mount(App, { global: { plugins: [router], provide: { [cardsGatewayKey as symbol]: gateway } } })
  await flushPromises()
  return { w, router }
}

afterEach(() => vi.restoreAllMocks())

describe('Consulta de tarjetas (integración)', () => {
  it('lists cards, navigates to detail and never calls fetch', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const { w, router } = await setup('/tarjetas')
    expect(w.text()).toContain('Visa Platinum')
    await w.find('button.card-item').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.fullPath).toBe('/tarjetas/c-001')
    expect(w.text()).toContain('Últimos movimientos')
    expect(w.text()).toContain('Supermercado Ejemplo')
    expect(fetchSpy).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('shows not-found message for unknown card', async () => {
    const { w } = await setup('/tarjetas/nope')
    expect(w.text()).toContain('no existe')
  })

  it('shows error state and retries', async () => {
    const base = new MockCardsGateway()
    let fail = true
    const gw: CardsGateway = {
      listCards: () => (fail ? Promise.reject(new Error('x')) : base.listCards()),
      getCard: (id) => base.getCard(id),
      getMovements: (id) => base.getMovements(id)
    }
    const { w } = await setup('/tarjetas', gw)
    expect(w.find('[role="alert"]').exists()).toBe(true)
    fail = false
    await w.find('[role="alert"] button').trigger('click')
    await flushPromises()
    expect(w.text()).toContain('Visa Platinum')
  })
})
