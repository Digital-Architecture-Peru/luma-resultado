/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COUNTER_INITIAL?: string
  readonly VITE_COUNTER_STEP?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
