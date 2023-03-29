import { createApp } from 'vue'
import store from './store'

import App from './App.vue'
import router from './router'

import '@arcgis/core/assets/esri/themes/dark/main.css'
import '@/assets/style/global.css'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
