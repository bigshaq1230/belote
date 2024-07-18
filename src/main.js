// main.js
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'
import App from './App.vue'
import router from './router'

console.log('main.js')

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(vue3GoogleLogin, {
  autoLogin: true,
  clientId: import.meta.env.VITE_GOOGLE_API_KEY
})

app.mount('#app')
