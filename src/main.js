import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

const app = createApp(App)

app.use(router, VueToast)

app.mount('#app')
