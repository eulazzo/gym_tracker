import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth state
import { useAuthStore } from './stores/auth'
import { useWorkoutStore } from './stores/workout'

const authStore = useAuthStore()
const workoutStore = useWorkoutStore()

authStore.initAuth()
workoutStore.initWorkoutData()

app.mount('#app')