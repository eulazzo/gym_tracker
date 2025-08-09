<template>
  <div class="h-screen bg-gray-50 flex overflow-hidden">
    <!-- Sidebar -->
    <div 
      class="flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out bg-white border-r border-gray-200"
      :class="sidebarCollapsed ? 'w-16' : 'w-64'"
    >
      <div class="flex flex-col h-full">
        <!-- Sidebar Header -->
        <div class="flex items-center h-16 px-4 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div class="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 v-if="!sidebarCollapsed" class="text-lg font-semibold text-gray-900">
              GymTracker
            </h1>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-2 py-4 overflow-y-auto">
          <div class="space-y-1">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              class="sidebar-item group relative"
              :class="{ 'active': route.name === item.name }"
            >
              <component
                :is="item.icon"
                class="flex-shrink-0 h-5 w-5 transition-colors duration-200"
                :class="sidebarCollapsed ? 'mx-auto' : 'mr-3'"
              />
              <span v-if="!sidebarCollapsed" class="truncate">{{ item.label }}</span>
              
              <!-- Tooltip for collapsed sidebar -->
              <div
                v-if="sidebarCollapsed"
                class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50"
              >
                {{ item.label }}
              </div>
            </router-link>
          </div>
        </nav>

        <!-- User Section -->
        <div class="flex-shrink-0 border-t border-gray-200">
          <div class="px-4 py-3">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shadow-sm">
                  <span class="text-sm font-medium text-primary-700">
                    {{ (authStore.user as any)?.name?.charAt(0).toUpperCase() }}
                  </span>
                </div>
              </div>
              <div v-if="!sidebarCollapsed" class="ml-3 flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-700 truncate">
                  {{ (authStore.user as any)?.name }}
                </p>
                <button
                  @click="handleLogout"
                  class="text-xs text-gray-500 hover:text-red-600 transition-colors duration-200"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <button
                @click="sidebarCollapsed = !sidebarCollapsed"
                class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-200"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              
              <div>
                <h1 class="text-xl font-semibold text-gray-900">
                  {{ getCurrentPageTitle() }}
                </h1>
                <p class="text-sm text-gray-500">
                  {{ getCurrentPageDescription() }}
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <!-- Quick actions -->
              <button
                @click="quickCheckIn"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm"
              >
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Check-in Rápido
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto bg-gray-50">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <router-view />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useWorkoutStore } from '../stores/workout'


// Icons (using Heroicons as SVG components)
import HomeIcon from '../components/icons/HomeIcon.vue'
import WorkoutIcon from '../components/icons/WorkoutIcon.vue'
import ExerciseIcon from '../components/icons/ExerciseIcon.vue'
import ProgressIcon from '../components/icons/ProgressIcon.vue'
import ProfileIcon from '../components/icons/ProfileIcon.vue'
import GoalsIcon from '../components/icons/GoalsIcon.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const workoutStore = useWorkoutStore()

const sidebarCollapsed = ref(false)

const navigation = [
  { name: 'dashboard', label: 'Dashboard', icon: HomeIcon, to: '/' },
  { name: 'workouts', label: 'Treinos', icon: WorkoutIcon, to: '/workouts' },
  { name: 'exercises', label: 'Exercícios', icon: ExerciseIcon, to: '/exercises' },
  { name: 'progress', label: 'Progresso', icon: ProgressIcon, to: '/progress' },
  { name: 'goals', label: 'Metas', icon: GoalsIcon, to: '/goals' },
  { name: 'profile', label: 'Perfil', icon: ProfileIcon, to: '/profile' }
]

const getCurrentPageTitle = () => {
  const currentNav = navigation.find(nav => nav.name === route.name)
  return currentNav?.label || 'GymTracker'
}

const getCurrentPageDescription = () => {
  const descriptions: Record<string, string> = {
    dashboard: 'Visão geral dos seus treinos e progressos',
    workouts: 'Gerencie e acompanhe seus treinos',
    exercises: 'Biblioteca de exercícios e movimentos',
    progress: 'Acompanhe sua evolução e métricas',
    goals: 'Defina e acompanhe suas metas e objetivos',
    profile: 'Configurações da conta e preferências'
  }
  return descriptions[route.name as string] || ''
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const quickCheckIn = () => {
  workoutStore.quickCheckIn()
  router.push('/workouts')
}
</script>

<style scoped>
.sidebar-item {
  @apply flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 ease-in-out;
}

.sidebar-item.active {
  @apply bg-primary-50 text-primary-700 border-r-2 border-primary-500;
}

.sidebar-item:hover {
  @apply transform translate-x-1;
}
</style>