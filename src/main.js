import { createApp } from 'vue'
import store from './store'

import App from './App.vue'
import router from './router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// import 'element-plus/theme-chalk/src/message.scss'
// 初始化指令
import initDirectives from './directives'

import '@arcgis/core/assets/esri/themes/dark/main.css'
import '@/assets/styles/global.css'

const app = createApp(App)
initDirectives(app)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(store)

app.mount('#app')
