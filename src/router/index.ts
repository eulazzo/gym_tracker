import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Lazy load components
const Login = () => import('../views/Login.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Workouts = () => import('../views/Workouts.vue')
const Exercises = () => import('../views/Exercises.vue')
const Progress = () => import('../views/Progress.vue')
const Profile = () => import('../views/Profile.vue')
const Goals = () => import('../views/Goals.vue')
const Layout = () => import('../components/Layout.vue')

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: '/workouts',
        name: 'workouts', 
        component: Workouts
      },
      {
        path: '/exercises',
        name: 'exercises',
        component: Exercises
      },
      {
        path: '/progress',
        name: 'progress',
        component: Progress
      },
      {
        path: '/profile',
        name: 'profile',
        component: Profile
      },
      {
        path: '/goals',
        name: 'goals',
        component: Goals
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.hideForAuth && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router