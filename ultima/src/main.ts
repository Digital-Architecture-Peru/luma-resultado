import { createApp } from 'vue'
import App from './App.vue'
import { cardRepositoryKey } from './composables/repositoryKey'
import { InMemoryCardRepository } from './infrastructure/inMemoryCardRepository'
import './styles/tokens.css'

// Único punto de montaje y de composición. Integración: Ninguna (datos en memoria).
createApp(App).provide(cardRepositoryKey, new InMemoryCardRepository()).mount('#app')
