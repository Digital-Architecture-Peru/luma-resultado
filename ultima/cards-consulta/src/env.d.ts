/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CARDS_DATA_SOURCE?: string;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}
