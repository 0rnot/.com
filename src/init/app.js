import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import App from '@/App.vue'
import router from '@/router'

export function initApp() {
  const app = createApp(App)
  app.use(ArcoVue)
  app.use(ArcoVueIcon)
  app.use(router)
  app.mount('#app')

  return app
}
