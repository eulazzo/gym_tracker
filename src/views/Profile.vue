<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Perfil</h2>
      <p class="text-sm text-gray-600 mt-1">Gerencie suas informações pessoais e preferências</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Informações Pessoais</h3>
            <button
              v-if="!editingProfile"
              @click="editingProfile = true"
              class="btn-ghost text-sm"
            >
              Editar
            </button>
          </div>

          <form v-if="editingProfile" @submit.prevent="saveProfile" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              <input
                v-model="profileForm.name"
                type="text"
                class="input-field"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="input-field"
                required
              />
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="cancelEditProfile"
                class="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                Salvar Alterações
              </button>
            </div>
          </form>

          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <p class="text-gray-900">{{ authStore.user?.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p class="text-gray-900">{{ authStore.user?.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Membro desde</label>
              <p class="text-gray-900">{{ formatDate(authStore.user?.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Goals -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Objetivos</h3>
            <button
              v-if="!editingGoals"
              @click="editingGoals = true"
              class="btn-ghost text-sm"
            >
              Editar
            </button>
          </div>

          <form v-if="editingGoals" @submit.prevent="saveGoals" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Treinos por Semana</label>
              <select v-model.number="goalsForm.weeklyWorkouts" class="input-field">
                <option :value="1">1 treino</option>
                <option :value="2">2 treinos</option>
                <option :value="3">3 treinos</option>
                <option :value="4">4 treinos</option>
                <option :value="5">5 treinos</option>
                <option :value="6">6 treinos</option>
                <option :value="7">7 treinos</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Peso Objetivo (kg)</label>
              <input
                v-model.number="goalsForm.targetWeight"
                type="number"
                step="0.1"
                min="30"
                max="300"
                class="input-field"
                placeholder="Ex: 75.5"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">% Gordura Objetivo</label>
              <input
                v-model.number="goalsForm.targetBodyFat"
                type="number"
                step="0.1"
                min="3"
                max="50"
                class="input-field"
                placeholder="Ex: 12.0"
              />
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="cancelEditGoals"
                class="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                Salvar Objetivos
              </button>
            </div>
          </form>

          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Treinos por Semana</label>
              <p class="text-gray-900">{{ authStore.user?.goals?.weeklyWorkouts || 'Não definido' }} treino(s)</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Peso Objetivo</label>
              <p class="text-gray-900">{{ authStore.user?.goals?.targetWeight ? authStore.user.goals.targetWeight + 'kg' : 'Não definido' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">% Gordura Objetivo</label>
              <p class="text-gray-900">{{ authStore.user?.goals?.targetBodyFat ? authStore.user.goals.targetBodyFat + '%' : 'Não definido' }}</p>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Preferências</h3>
            <button
              v-if="!editingPreferences"
              @click="editingPreferences = true"
              class="btn-ghost text-sm"
            >
              Editar
            </button>
          </div>

          <form v-if="editingPreferences" @submit.prevent="savePreferences" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Início da Semana</label>
              <select v-model.number="preferencesForm.weekStartsOn" class="input-field">
                <option :value="0">Domingo</option>
                <option :value="1">Segunda-feira</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Descanso Padrão (segundos)</label>
              <input
                v-model.number="preferencesForm.defaultRestTime"
                type="number"
                min="30"
                max="600"
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sistema de Medidas</label>
              <select v-model="preferencesForm.units" class="input-field">
                <option value="metric">Métrico (kg, cm)</option>
                <option value="imperial">Imperial (lb, in)</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="cancelEditPreferences"
                class="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                Salvar Preferências
              </button>
            </div>
          </form>

          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Início da Semana</label>
              <p class="text-gray-900">{{ authStore.user?.preferences?.weekStartsOn === 0 ? 'Domingo' : 'Segunda-feira' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descanso Padrão</label>
              <p class="text-gray-900">{{ authStore.user?.preferences?.defaultRestTime || 90 }}s</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sistema de Medidas</label>
              <p class="text-gray-900">{{ authStore.user?.preferences?.units === 'metric' ? 'Métrico' : 'Imperial' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Sidebar -->
      <div class="space-y-6">
        <!-- Quick Stats -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Suas Estatísticas</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total de Treinos</span>
              <span class="font-semibold text-gray-900">{{ workoutStore.totalWorkouts }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Esta Semana</span>
              <span class="font-semibold text-gray-900">{{ workoutStore.thisWeekWorkouts.length }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Frequência</span>
              <span class="font-semibold text-gray-900">{{ Math.round(workoutStore.weeklyFrequency) }}%</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Exercícios</span>
              <span class="font-semibold text-gray-900">{{ (workoutStore.exercises as any[]).length }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Medições</span>
              <span class="font-semibold text-gray-900">{{ (workoutStore.bodyMetrics as any[]).length }}</span>
            </div>
          </div>
        </div>

        <!-- Progress Goals -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Progresso dos Objetivos</h3>
          
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Meta Semanal</span>
                <span>{{ workoutStore.thisWeekWorkouts.length }}/{{ authStore.user?.goals?.weeklyWorkouts || 4 }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary-600 h-2 rounded-full"
                  :style="{ width: `${Math.min((workoutStore.thisWeekWorkouts.length / (authStore.user?.goals?.weeklyWorkouts || 4)) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
            
            <div v-if="authStore.user?.goals?.targetWeight && workoutStore.latestBodyMetrics?.weight">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Peso Objetivo</span>
                <span>{{ workoutStore.latestBodyMetrics.weight }}kg / {{ authStore.user.goals.targetWeight }}kg</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-secondary-600 h-2 rounded-full"
                  :style="{ width: `${Math.min((workoutStore.latestBodyMetrics.weight / authStore.user.goals.targetWeight) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Conta</h3>
          
          <div class="space-y-3">
            <button
              @click="exportData"
              class="w-full btn-secondary text-left"
            >
              <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Exportar Dados
            </button>
            
            <button
              @click="confirmLogout"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useWorkoutStore } from '../stores/workout'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const router = useRouter()
const authStore = useAuthStore()
const workoutStore = useWorkoutStore()

const editingProfile = ref(false)
const editingGoals = ref(false)
const editingPreferences = ref(false)

const profileForm = reactive({
  name: '',
  email: ''
})

const goalsForm = reactive({
  weeklyWorkouts: 4,
  targetWeight: null as number | null,
  targetBodyFat: null as number | null
})

const preferencesForm = reactive({
  weekStartsOn: 1 as 0 | 1,
  defaultRestTime: 90,
  units: 'metric' as 'metric' | 'imperial'
})

// Methods
const formatDate = (date: Date | undefined) => {
  if (!date) return 'N/A'
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
}

const saveProfile = () => {
  authStore.updateProfile({
    name: profileForm.name,
    email: profileForm.email
  })
  editingProfile.value = false
}

const cancelEditProfile = () => {
  profileForm.name = authStore.user?.name || ''
  profileForm.email = authStore.user?.email || ''
  editingProfile.value = false
}

const saveGoals = () => {
  authStore.updateProfile({
    goals: {
      weeklyWorkouts: goalsForm.weeklyWorkouts,
      targetWeight: goalsForm.targetWeight || undefined,
      targetBodyFat: goalsForm.targetBodyFat || undefined
    }
  })
  editingGoals.value = false
}

const cancelEditGoals = () => {
  goalsForm.weeklyWorkouts = authStore.user?.goals?.weeklyWorkouts || 4
  goalsForm.targetWeight = authStore.user?.goals?.targetWeight || null
  goalsForm.targetBodyFat = authStore.user?.goals?.targetBodyFat || null
  editingGoals.value = false
}

const savePreferences = () => {
  if (authStore.user) {
    authStore.updateProfile({
      preferences: {
        ...authStore.user.preferences,
        weekStartsOn: preferencesForm.weekStartsOn,
        defaultRestTime: preferencesForm.defaultRestTime,
        units: preferencesForm.units
      }
    })
  }
  editingPreferences.value = false
}

const cancelEditPreferences = () => {
  preferencesForm.weekStartsOn = authStore.user?.preferences?.weekStartsOn || 1
  preferencesForm.defaultRestTime = authStore.user?.preferences?.defaultRestTime || 90
  preferencesForm.units = authStore.user?.preferences?.units || 'metric'
  editingPreferences.value = false
}

const exportData = () => {
  const data = {
    user: authStore.user,
    workouts: workoutStore.workouts,
    exercises: workoutStore.exercises,
    bodyMetrics: workoutStore.bodyMetrics,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gymtracker-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const confirmLogout = () => {
  if (confirm('Tem certeza que deseja sair da sua conta?')) {
    authStore.logout()
    router.push('/login')
  }
}

// Initialize forms with current data
if (authStore.user) {
  profileForm.name = authStore.user.name
  profileForm.email = authStore.user.email
  
  goalsForm.weeklyWorkouts = authStore.user.goals?.weeklyWorkouts || 4
  goalsForm.targetWeight = authStore.user.goals?.targetWeight || null
  goalsForm.targetBodyFat = authStore.user.goals?.targetBodyFat || null
  
  preferencesForm.weekStartsOn = authStore.user.preferences?.weekStartsOn || 1
  preferencesForm.defaultRestTime = authStore.user.preferences?.defaultRestTime || 90
  preferencesForm.units = authStore.user.preferences?.units || 'metric'
}
</script>