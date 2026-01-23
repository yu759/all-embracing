import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/routes'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'

const app = createApp(App)

// 使用 Pinia
const pinia = createPinia()
app.use(pinia)

// 使用路由
app.use(router)

// 使用 Ant Design Vue
app.use(Antd)

app.mount('#app')