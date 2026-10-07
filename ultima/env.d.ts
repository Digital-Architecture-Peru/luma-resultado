/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CARDS_API_BASE_URL?: string
  readonly VITE_LOCALE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
