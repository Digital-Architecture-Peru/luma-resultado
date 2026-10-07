/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_CARDS_ADAPTER?: string
  readonly VITE_LOCALE?: string
  readonly VITE_CURRENCY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
