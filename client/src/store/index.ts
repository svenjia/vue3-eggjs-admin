import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persistedstate'

const store = createPinia()

store.use(piniaPluginPersist)

export const setupStore = (app: App<Element>) => {
  app.use(store)
}

export { store }
