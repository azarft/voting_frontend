import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import { router, setupRouterGuards } from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
setupRouterGuards(pinia)
app.use(router)

app.mount('#app')
