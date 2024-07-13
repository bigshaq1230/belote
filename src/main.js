import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pania = createPinia()
app.use(router)
app.use(pania)
app.use(vue3GoogleLogin,{
    autoLogin:true,
    clientId:import.meta.env.VITE_GOOGLE_API_KEY
})

app.mount('#app')
