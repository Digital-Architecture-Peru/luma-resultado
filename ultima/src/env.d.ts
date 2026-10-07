/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CARDS_ADAPTER?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_LOCALE?: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
