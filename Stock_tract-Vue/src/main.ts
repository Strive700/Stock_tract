import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
axios.defaults.withCredentials = true
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Toast)
app.mount('#app')
