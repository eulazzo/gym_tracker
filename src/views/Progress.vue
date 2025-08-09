<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Progresso</h2>
        <p class="text-sm text-gray-600 mt-1">Acompanhe sua evolução e métricas</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button @click="showMetricsModal = true" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nova Medição
        </button>
      </div>
    </div>

    <!-- Progress Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card text-center">
        <div class="text-2xl font-bold text-primary-600">{{ totalWorkouts }}</div>
        <div class="text-sm text-gray-600">Total de Treinos</div>
        <div class="text-xs text-gray-500 mt-1">
          +{{ thisMonthWorkouts }} este mês
        </div>
      </div>

      <div class="card text-center">
        <div class="text-2xl font-bold text-secondary-600">{{ currentWeight }}kg</div>
        <div class="text-sm text-gray-600">Peso Atual</div>
        <div class="text-xs text-green-600 mt-1" v-if="weightTrend > 0">
          +{{ weightTrend.toFixed(1) }}kg
        </div>
        <div class="text-xs text-red-600 mt-1" v-else-if="weightTrend < 0">
          {{ weightTrend.toFixed(1) }}kg
        </div>
        <div class="text-xs text-gray-500 mt-1" v-else>
          Sem mudança
        </div>
      </div>

      <div class="card text-center">
        <div class="text-2xl font-bold text-purple-600">{{ averageFrequency }}%</div>
        <div class="text-sm text-gray-600">Frequência Média</div>
        <div class="text-xs text-gray-500 mt-1">Últimas 4 semanas</div>
      </div>

      <div class="card text-center">
        <div class="text-2xl font-bold text-orange-600">{{ totalVolume }}</div>
        <div class="text-sm text-gray-600">Volume Total</div>
        <div class="text-xs text-gray-500 mt-1">kg levantados</div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Weight Progress Chart -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Evolução do Peso</h3>
          <div class="flex items-center space-x-2">
            <button
              @click="weightPeriod = '3months'"
              :class="weightPeriod === '3months' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'"
              class="px-3 py-1 text-sm rounded"
            >
              3M
            </button>
            <button
              @click="weightPeriod = '6months'"
              :class="weightPeriod === '6months' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'"
              class="px-3 py-1 text-sm rounded"
            >
              6M
            </button>
            <button
              @click="weightPeriod = '1year'"
              :class="weightPeriod === '1year' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'"
              class="px-3 py-1 text-sm rounded"
            >
              1A
            </button>
          </div>
        </div>
        
        <div v-if="weightData.length > 1" class="h-64 flex items-center justify-center">
          <!-- Placeholder for chart -->
          <div class="text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-sm">Gráfico de evolução do peso</p>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 mb-1">Sem dados suficientes</h3>
          <p class="text-sm text-gray-500">Adicione pelo menos 2 medições para ver o gráfico</p>
        </div>
      </div>

      <!-- Workout Frequency Chart -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Frequência Semanal</h3>
        </div>
        
        <div v-if="(workoutStore.bodyMetrics as any[]).length > 0" class="h-64 flex items-center justify-center">
          <!-- Placeholder for chart -->
          <div class="text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-sm">Gráfico de frequência semanal</p>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 mb-1">Nenhum treino registrado</h3>
          <p class="text-sm text-gray-500">Comece treinando para ver seus gráficos</p>
        </div>
      </div>
    </div>

    <!-- Body Measurements -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Medidas Corporais</h3>
      </div>
      
      <div v-if="(workoutStore.bodyMetrics as any[]).length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Gordura</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peito</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cintura</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bíceps</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="metric in sortedBodyMetrics" :key="metric.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ format(new Date(metric.date), 'dd/MM/yyyy') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ metric.weight ? `${metric.weight}kg` : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ metric.bodyFat ? `${metric.bodyFat}%` : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ metric.measurements.chest ? `${metric.measurements.chest}cm` : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ metric.measurements.waist ? `${metric.measurements.waist}cm` : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ metric.measurements.bicep ? `${metric.measurements.bicep}cm` : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="text-center py-12">
        <div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-1">Nenhuma medição registrada</h3>
      <p class="text-sm text-gray-500 mb-4">Acompanhe sua evolução corporal</p>
      <button @click="showMetricsModal = true" class="btn-primary">
        Primeira Medição
      </button>
    </div>
  </div>

  <!-- Body Metrics Modal -->
  <div
    v-if="showMetricsModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="showMetricsModal = false"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Nova Medição Corporal</h3>
          <button @click="showMetricsModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveMetrics" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
              <input
                v-model.number="metricsForm.weight"
                type="number"
                step="0.1"
                min="30"
                max="300"
                class="input-field"
                placeholder="70.5"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">% Gordura</label>
              <input
                v-model.number="metricsForm.bodyFat"
                type="number"
                step="0.1"
                min="3"
                max="50"
                class="input-field"
                placeholder="15.2"
              />
            </div>
          </div>

          <div class="space-y-3">
            <h4 class="text-sm font-medium text-gray-700">Medidas (cm)</h4>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">Peito</label>
                <input
                  v-model.number="metricsForm.measurements.chest"
                  type="number"
                  step="0.1"
                  class="input-field"
                  placeholder="95.0"
                />
              </div>

              <div>
                <label class="block text-xs text-gray-600 mb-1">Cintura</label>
                <input
                  v-model.number="metricsForm.measurements.waist"
                  type="number"
                  step="0.1"
                  class="input-field"
                  placeholder="80.0"
                />
              </div>

              <div>
                <label class="block text-xs text-gray-600 mb-1">Quadril</label>
                <input
                  v-model.number="metricsForm.measurements.hips"
                  type="number"
                  step="0.1"
                  class="input-field"
                  placeholder="95.0"
                />
              </div>

              <div>
                <label class="block text-xs text-gray-600 mb-1">Bíceps</label>
                <input
                  v-model.number="metricsForm.measurements.bicep"
                  type="number"
                  step="0.1"
                  class="input-field"
                  placeholder="35.0"
                />
              </div>

              <div>
                <label class="block text-xs text-gray-600 mb-1">Coxa</label>
                <input
                  v-model.number="metricsForm.measurements.thigh"
                  type="number"
                  step="0.1"
                  class="input-field"
                  placeholder="55.0"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showMetricsModal = false" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              Salvar Medição
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useWorkoutStore } from '../stores/workout'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

const workoutStore = useWorkoutStore()

const showMetricsModal = ref(false)
const weightPeriod = ref<'3months' | '6months' | '1year'>('3months')

const metricsForm = reactive({
  weight: null as number | null,
  bodyFat: null as number | null,
  measurements: {
    chest: null as number | null,
    waist: null as number | null,
    hips: null as number | null,
    bicep: null as number | null,
    thigh: null as number | null
  }
})

// Computed values
const totalWorkouts = computed(() => workoutStore.totalWorkouts)

const thisMonthWorkouts = computed(() => {
  const start = startOfMonth(new Date())
  const end = endOfMonth(new Date())
  
  return workoutStore.workouts.filter(w => {
    const workoutDate = new Date(w.date)
    return workoutDate >= start && workoutDate <= end
  }).length
})

const currentWeight = computed(() => {
  const latest = workoutStore.latestBodyMetrics
  return latest?.weight || 0
})

const weightTrend = computed(() => {
  const sorted = workoutStore.bodyMetrics
    .filter(m => m.weight)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  if (sorted.length < 2) return 0
  return sorted[0].weight! - sorted[1].weight!
})

const averageFrequency = computed(() => {
  // Simplified calculation for demo
  const recent = workoutStore.workouts.slice(-28) // Last 4 weeks
  return Math.round((recent.length / 28) * 7 * 100) // Convert to weekly percentage
})

const totalVolume = computed(() => {
  // Simplified volume calculation
  let volume = 0
  workoutStore.workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        volume += set.weight * set.reps
      })
    })
  })
  return Math.round(volume / 1000) + 'k' // Convert to thousands
})

const weightData = computed(() => {
  const months = weightPeriod.value === '3months' ? 3 : weightPeriod.value === '6months' ? 6 : 12
  const cutoff = subMonths(new Date(), months)
  
  return workoutStore.bodyMetrics
    .filter(m => m.weight && new Date(m.date) >= cutoff)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const sortedBodyMetrics = computed(() => {
  return workoutStore.bodyMetrics
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10) // Show last 10 entries
})

// Methods
const saveMetrics = () => {
  const measurements: any = {}
  
  // Only include non-null measurements
  if (metricsForm.measurements.chest) measurements.chest = metricsForm.measurements.chest
  if (metricsForm.measurements.waist) measurements.waist = metricsForm.measurements.waist
  if (metricsForm.measurements.hips) measurements.hips = metricsForm.measurements.hips
  if (metricsForm.measurements.bicep) measurements.bicep = metricsForm.measurements.bicep
  if (metricsForm.measurements.thigh) measurements.thigh = metricsForm.measurements.thigh
  
  workoutStore.addBodyMetric({
    date: new Date(),
    weight: metricsForm.weight || undefined,
    bodyFat: metricsForm.bodyFat || undefined,
    measurements
  })
  
  // Reset form
  metricsForm.weight = null
  metricsForm.bodyFat = null
  metricsForm.measurements.chest = null
  metricsForm.measurements.waist = null
  metricsForm.measurements.hips = null
  metricsForm.measurements.bicep = null
  metricsForm.measurements.thigh = null
  
  showMetricsModal.value = false
}

const getWorkoutStats = () => {
  return (workoutStore.workouts as any[]).filter((w: any) => {
    const workoutDate = new Date(w.date)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)
    return workoutDate >= cutoff
  })
}

const getWeightData = () => {
  const sorted = (workoutStore.bodyMetrics as any[])
    .filter((m: any) => m.weight)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return sorted.slice(0, 10).reverse()
}

const getWeeklyWorkouts = () => {
  const recent = (workoutStore.workouts as any[]).slice(-28) // Last 4 weeks
  const weekly = new Array(4).fill(0)
  
  recent.forEach((workout: any) => {
    const weekIndex = Math.floor((Date.now() - new Date(workout.date).getTime()) / (7 * 24 * 60 * 60 * 1000))
    if (weekIndex < 4) {
      weekly[weekIndex]++
    }
  })
  
  return weekly.reverse()
}

const getExerciseProgress = () => {
  const exerciseStats: { [key: string]: { total: number; maxWeight: number } } = {}
  
  ;(workoutStore.workouts as any[]).forEach((workout: any) => {
    workout.exercises.forEach((exercise: any) => {
      exercise.sets.forEach((set: any) => {
        if (!exerciseStats[exercise.exerciseId]) {
          exerciseStats[exercise.exerciseId] = { total: 0, maxWeight: 0 }
        }
        exerciseStats[exercise.exerciseId].total += set.reps
        exerciseStats[exercise.exerciseId].maxWeight = Math.max(exerciseStats[exercise.exerciseId].maxWeight, set.weight)
      })
    })
  })
  
  return exerciseStats
}

const getWeightProgress = () => {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - 3)
  
  return (workoutStore.bodyMetrics as any[])
    .filter((m: any) => m.weight && new Date(m.date) >= cutoff)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

const getBodyFatProgress = () => {
  return (workoutStore.bodyMetrics as any[])
    .filter((m: any) => m.bodyFat)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
</script>