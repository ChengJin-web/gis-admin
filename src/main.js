import { createApp } from 'vue'
import store from './store'

import App from './App.vue'
import router from './router'

import '@/assets/style/global.css'

// import ElementPlus from 'element-plus'
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// app.use(ElementPlus, {
//   locale: zhCn
// })

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
