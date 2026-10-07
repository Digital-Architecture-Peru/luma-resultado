import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import CardsListPage from '../pages/CardsListPage.vue'
import CardDetailPage from '../pages/CardDetailPage.vue'

export const routes = [
  { path: '/', redirect: '/tarjetas' },
  { path: '/tarjetas', name: 'cards', component: CardsListPage },
  { path: '/tarjetas/:id', name: 'card-detail', component: CardDetailPage },
  { path: '/:pathMatch(.*)*', redirect: '/tarjetas' }
]

export function createAppRouter(history: RouterHistory = createWebHistory()) {
  return createRouter({ history, routes })
}
