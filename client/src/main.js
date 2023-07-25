import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vue3GoogleLogin from 'vue3-google-login'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(vue3GoogleLogin, {
    clientId: GOOGLE_CLIENT_ID}),
app.mount('#app')
