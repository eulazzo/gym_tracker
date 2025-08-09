<template>
  <div class="space-y-8">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="card group hover:shadow-medium transition-all duration-300 cursor-pointer border-0 shadow-soft"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm"
              :class="stat.iconBg"
            >
              <component :is="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
            </div>
          </div>
          <div class="ml-4 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
              <dd>
                <div class="text-xl font-semibold text-gray-900">{{ stat.value }}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Today's Workout -->
      <div class="card border-0 shadow-soft">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Treino de Hoje</h3>
          <button
            v-if="!workoutStore.todayWorkout"
            @click="startWorkout"
            class="btn-primary text-sm"
          >
            Iniciar Treino
          </button>
        </div>
        
        <div v-if="workoutStore.todayWorkout" class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-sm">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-900">Treino em Andamento</p>
                <p class="text-xs text-green-700">{{ workoutStore.todayWorkout.type }}</p>
              </div>
            </div>
            <router-link to="/workouts" class="btn-ghost text-sm">
              Continuar →
            </router-link>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <div class="w-12 h-12 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 mb-1">Nenhum treino hoje</h3>
          <p class="text-sm text-gray-500">Que tal começar agora?</p>
        </div>
      </div>

      <!-- Weekly Progress -->
      <div class="card border-0 shadow-soft">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Frequência Semanal</h3>
          <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            {{ Math.round(workoutStore.weeklyFrequency) }}%
          </span>
        </div>
        
        <div class="space-y-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Meta da Semana</span>
            <span class="font-medium text-gray-900">{{ (authStore.user as any)?.goals?.weeklyWorkouts || 4 }} treinos</span>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              class="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
              :style="{ width: `${Math.min(workoutStore.weeklyFrequency, 100)}%` }"
            ></div>
          </div>
          
          <div class="flex justify-between text-xs text-gray-500">
            <span>{{ workoutStore.thisWeekWorkouts.length }} realizados</span>
            <span>{{ Math.max(0, ((authStore.user as any)?.goals?.weeklyWorkouts || 4) - workoutStore.thisWeekWorkouts.length) }} restantes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Goals Overview -->
    <div class="card border-0 shadow-soft">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Metas e Objetivos</h3>
        <router-link to="/goals" class="btn-ghost text-sm">
          Ver Todas →
        </router-link>
      </div>
      
      <div v-if="goalsStore.activeGoals.length > 0" class="space-y-4">
        <div
          v-for="goal in goalsStore.activeGoals.slice(0, 3)"
          :key="goal.id"
          class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
        >
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-blue-900">{{ goal.title }}</h4>
            <span class="text-sm text-blue-700">{{ Math.round((goal.currentValue / goal.targetValue) * 100) }}%</span>
          </div>
          
          <p class="text-sm text-blue-700 mb-3">{{ goal.description }}</p>
          
          <div class="w-full bg-blue-200 rounded-full h-2 mb-2">
            <div
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%` }"
            ></div>
          </div>
          
          <div class="flex justify-between text-xs text-blue-600">
            <span>{{ goal.currentValue }}{{ goal.unit }} / {{ goal.targetValue }}{{ goal.unit }}</span>
            <span>Prazo: {{ formatDate(goal.deadline) }}</span>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8">
        <div class="w-12 h-12 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <svg class="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-900 mb-1">Nenhuma meta ativa</h3>
        <p class="text-sm text-gray-500">Defina suas primeiras metas para começar!</p>
        <router-link to="/goals" class="btn-primary text-sm mt-3">
          Criar Meta
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkoutStore } from '../stores/workout'
import { useGoalsStore } from '../stores/goals'
import { useAuthStore } from '../stores/auth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const workoutStore = useWorkoutStore()
const goalsStore = useGoalsStore()
const authStore = useAuthStore()

// Stats computation
const stats = computed(() => [
  {
    name: 'Total de Treinos',
    value: workoutStore.totalWorkouts.toString(),
    icon: 'svg',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600'
  },
  {
    name: 'Esta Semana',
    value: workoutStore.thisWeekWorkouts.length.toString(),
    icon: 'svg',
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600'
  },
  {
    name: 'Metas Ativas',
    value: goalsStore.activeGoals.length.toString(),
    icon: 'svg',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    name: 'Progresso Geral',
    value: `${goalsStore.goalsProgress}%`,
    icon: 'svg',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  }
])

const startWorkout = () => {
  // Implementar lógica para iniciar treino
  console.log('Iniciando treino...')
}

const formatDate = (date: Date) => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
}
</script>