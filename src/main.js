import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pania = createPinia()
app.use(router)
app.use(pania)

app.mount('#app')
