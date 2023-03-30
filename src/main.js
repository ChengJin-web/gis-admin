import { createApp } from 'vue'
import store from './store'

import App from './App.vue'
import router from './router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import '@arcgis/core/assets/esri/themes/dark/main.css'
import '@/assets/styles/global.css'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(store)

app.mount('#app')
