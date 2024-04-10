import './assets/main.css'
import MyButton from '@/components/MyButton.vue'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).component('MyButton', MyButton).mount('#app')
