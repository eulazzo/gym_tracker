<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Seus Treinos</h2>
        <p class="text-sm text-gray-600 mt-1">Acompanhe e registre seus treinos</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button @click="showNewWorkoutModal = true" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Novo Treino
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card text-center">
        <div class="text-3xl font-bold text-primary-600">{{ workoutStore.thisWeekWorkouts.length }}</div>
        <div class="text-sm text-gray-600">Treinos esta semana</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl font-bold text-secondary-600">{{ Math.round(weeklyFrequency) }}%</div>
        <div class="text-sm text-gray-600">Frequência semanal</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl font-bold text-accent-600">{{ averageDuration }}</div>
        <div class="text-sm text-gray-600">Duração média (min)</div>
      </div>
    </div>

    <!-- Toggle de Visualização -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button 
          @click="viewMode = 'list'"
          :class="viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300'"
          class="px-4 py-2 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Lista
        </button>
        <button 
          @click="viewMode = 'calendar'"
          :class="viewMode === 'calendar' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300'"
          class="px-4 py-2 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Calendário
        </button>
      </div>
    </div>

    <!-- Vista de Calendário -->
    <div v-if="viewMode === 'calendar'" class="card">
      <CalendarView 
        :workouts="filteredWorkouts"
        @edit-workout="editWorkout"
      />
    </div>

    <!-- Vista de Lista -->
    <div v-if="viewMode === 'list'" class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Histórico de Treinos</h3>
        <div class="flex items-center space-x-2">
          <select v-model="filterType" class="input-field text-sm py-1">
            <option value="">Todos os tipos</option>
            <option value="Push">Push</option>
            <option value="Pull">Pull</option>
            <option value="Legs">Legs</option>
            <option value="Upper">Upper</option>
            <option value="Lower">Lower</option>
            <option value="Full Body">Full Body</option>
          </select>
        </div>
      </div>

      <div v-if="filteredWorkouts.length > 0" class="space-y-4">
        <div
          v-for="workout in paginatedWorkouts"
          :key="workout.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h4 class="text-lg font-semibold text-gray-900">{{ workout.type }}</h4>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {{ formatDate(workout.date) }}
                </span>
              </div>
              
              <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ workout.duration }}min
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {{ workout.exercises.length }} exercícios
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {{ calculateTotalSets(workout) }} séries
                </span>
              </div>

              <div v-if="workout.notes" class="text-sm text-gray-700 bg-gray-50 rounded p-2 mb-3">
                {{ workout.notes }}
              </div>

              <!-- Exercise Preview -->
              <div class="space-y-2">
                <div
                  v-for="exercise in workout.exercises.slice(0, 3)"
                  :key="exercise.exerciseId"
                  class="flex items-center justify-between text-sm"
                >
                  <span class="text-gray-700">{{ getExerciseName(exercise.exerciseId) }}</span>
                  <span class="text-gray-500">
                    {{ exercise.sets.length }} série{{ exercise.sets.length > 1 ? 's' : '' }}
                  </span>
                </div>
                <div v-if="workout.exercises.length > 3" class="text-xs text-gray-500">
                  + {{ workout.exercises.length - 3 }} exercícios a mais
                </div>
              </div>
            </div>

            <div class="flex flex-col space-y-2">
              <button
                @click="editWorkout(workout)"
                class="btn-ghost text-sm"
              >
                Editar
              </button>
              <button
                @click="deleteWorkoutConfirm(workout)"
                class="text-sm text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2 mt-6">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            class="px-3 py-1 text-sm rounded"
            :class="currentPage === page ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            {{ page }}
          </button>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum treino encontrado</h3>
        <p class="text-gray-600 mb-4">Comece registrando seu primeiro treino!</p>
        <button @click="showNewWorkoutModal = true" class="btn-primary">
          Criar Primeiro Treino
        </button>
      </div>
    </div>

    <!-- New/Edit Workout Modal -->
    <div
      v-if="showNewWorkoutModal || editingWorkout"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editingWorkout ? 'Editar Treino' : 'Novo Treino' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveWorkout" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Treino</label>
                <select v-model="workoutForm.type" class="input-field" required>
                  <option value="">Selecione...</option>
                  <option value="Push">Push (Empurrar)</option>
                  <option value="Pull">Pull (Puxar)</option>
                  <option value="Legs">Legs (Pernas)</option>
                  <option value="Upper">Upper (Superiores)</option>
                  <option value="Lower">Lower (Inferiores)</option>
                  <option value="Full Body">Full Body</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Duração (min)</label>
                <input
                  v-model.number="workoutForm.duration"
                  type="number"
                  min="5"
                  max="300"
                  class="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
              <textarea
                v-model="workoutForm.notes"
                rows="3"
                class="input-field"
                placeholder="Como foi o treino, como se sentiu, etc..."
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                {{ editingWorkout ? 'Salvar Alterações' : 'Criar Treino' }}
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
import { useWorkoutStore, type Workout } from '../stores/workout'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import CalendarView from '../components/CalendarView.vue'

const workoutStore = useWorkoutStore()

const showNewWorkoutModal = ref(false)
const editingWorkout = ref<Workout | null>(null)
const filterType = ref('')
const viewMode = ref<'list' | 'calendar'>('list')
const currentPage = ref(1)
const itemsPerPage = 5

const workoutForm = reactive({
  type: '',
  duration: 60,
  notes: ''
})

// Computed values
const weeklyFrequency = computed(() => workoutStore.weeklyFrequency)

const averageDuration = computed(() => {
  if (workoutStore.workouts.length === 0) return 0
  const total = workoutStore.workouts.reduce((sum, workout) => sum + workout.duration, 0)
  return Math.round(total / workoutStore.workouts.length)
})

const totalWorkoutTime = computed(() => {
  if ((workoutStore.workouts as any[]).length === 0) return 0
  const total = (workoutStore.workouts as any[]).reduce((sum: number, workout: any) => sum + workout.duration, 0)
  return Math.round(total / (workoutStore.workouts as any[]).length)
})

const filteredWorkouts = computed(() => {
  let workouts = (workoutStore.workouts as any[]).slice()
  
  if (filterType.value) {
    workouts = workouts.filter((workout: any) => workout.type === filterType.value)
  }
  
  return workouts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const totalPages = computed(() => {
  return Math.ceil(filteredWorkouts.value.length / itemsPerPage)
})

const paginatedWorkouts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredWorkouts.value.slice(start, end)
})

// Methods
const formatDate = (date: Date) => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
}

const calculateTotalSets = (workout: Workout) => {
  return workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)
}

const getExerciseName = (exerciseId: string) => {
  const exercise = (workoutStore.exercises as any[]).find((e: any) => e.id === exerciseId)
  return exercise?.name || 'Exercício desconhecido'
}

const editWorkout = (workout: Workout) => {
  editingWorkout.value = workout
  workoutForm.type = workout.type
  workoutForm.duration = workout.duration
  workoutForm.notes = workout.notes || ''
}

const deleteWorkoutConfirm = (workout: Workout) => {
  if (confirm('Tem certeza que deseja excluir este treino?')) {
    workoutStore.deleteWorkout(workout.id)
  }
}

const closeModal = () => {
  showNewWorkoutModal.value = false
  editingWorkout.value = null
  resetForm()
}

const resetForm = () => {
  workoutForm.type = ''
  workoutForm.duration = 60
  workoutForm.notes = ''
}

const saveWorkout = () => {
  if (editingWorkout.value) {
    // Update existing workout
    workoutStore.updateWorkout(editingWorkout.value.id, {
      type: workoutForm.type,
      duration: workoutForm.duration,
      notes: workoutForm.notes
    })
  } else {
    // Create new workout
    workoutStore.createWorkout({
      date: new Date(),
      exercises: [],
      type: workoutForm.type,
      duration: workoutForm.duration,
      notes: workoutForm.notes,
      startTime: new Date()
    })
  }
  
  closeModal()
}
</script>