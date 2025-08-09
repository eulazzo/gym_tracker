<template>
  <div class="calendar-container">
    <!-- Header do Calendário -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <button 
          @click="previousMonth" 
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          :disabled="isCurrentMonth"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 class="text-xl font-semibold text-gray-900">{{ currentMonthYear }}</h2>
        
        <button 
          @click="nextMonth" 
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div class="flex items-center space-x-2">
        <button 
          @click="goToToday"
          class="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Hoje
        </button>
        <button 
          @click="toggleView"
          class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {{ isListView ? 'Calendário' : 'Lista' }}
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700">Filtrar por:</span>
          <select v-model="filterType" class="text-sm border border-gray-300 rounded px-3 py-1">
            <option value="">Todos os tipos</option>
            <option value="Push">Push</option>
            <option value="Pull">Pull</option>
            <option value="Legs">Legs</option>
            <option value="Upper">Upper</option>
            <option value="Lower">Lower</option>
            <option value="Full Body">Full Body</option>
          </select>
        </div>
        
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700">Período:</span>
          <button 
            @click="setPeriod('current')"
            :class="period === 'current' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'"
            class="px-3 py-1 text-sm rounded border transition-colors"
          >
            Mês Atual
          </button>
          <button 
            @click="setPeriod('previous')"
            :class="period === 'previous' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'"
            class="px-3 py-1 text-sm rounded border transition-colors"
          >
            Mês Anterior
          </button>
        </div>
      </div>
    </div>

    <!-- Vista de Calendário -->
    <div v-if="!isListView" class="calendar-view">
      <!-- Dias da Semana -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div 
          v-for="day in weekDays" 
          :key="day"
          class="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg"
        >
          {{ day }}
        </div>
      </div>
      
      <!-- Grid do Calendário -->
      <div class="grid grid-cols-7 gap-1">
        <div 
          v-for="date in calendarDates" 
          :key="date.key"
          :class="getDateClasses(date)"
          @click="selectDate(date)"
          class="min-h-[120px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
        >
          <!-- Número do Dia -->
          <div class="flex items-center justify-between mb-2">
            <span 
              :class="getDateNumberClasses(date)"
              class="text-sm font-medium"
            >
              {{ date.day }}
            </span>
            
            <!-- Checkbox de Conclusão -->
            <input 
              v-if="date.workout"
              type="checkbox" 
              :checked="date.workout.completed"
              @change.stop="toggleWorkoutCompletion(date.workout)"
              class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
          </div>
          
          <!-- Indicador de Treino -->
          <div v-if="date.workout" class="space-y-1">
            <div 
              :class="getWorkoutTypeClasses(date.workout.type)"
              class="text-xs font-medium px-2 py-1 rounded-full text-center"
            >
              {{ date.workout.type }}
            </div>
            <div class="text-xs text-gray-600 text-center">
              {{ date.workout.duration }}min
            </div>
            <div class="text-xs text-gray-500 text-center">
              {{ date.workout.exercises.length }} ex.
            </div>
          </div>
          
          <!-- Indicador de Hoje -->
          <div v-if="date.isToday" class="mt-2">
            <div class="w-2 h-2 bg-primary-600 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista de Lista -->
    <div v-else class="list-view space-y-4">
      <div 
        v-for="workout in filteredWorkouts"
        :key="workout.id"
        class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div 
              :class="getWorkoutTypeClasses(workout.type)"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ workout.type }}
            </div>
            <div class="text-sm text-gray-600">
              {{ formatDate(workout.date) }}
            </div>
            <div class="text-sm text-gray-500">
              {{ workout.duration }}min • {{ workout.exercises.length }} exercícios
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              :checked="workout.completed"
              @change="toggleWorkoutCompletion(workout)"
              class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <button 
              @click="editWorkout(workout)"
              class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Treino -->
    <div
      v-if="selectedWorkout"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="selectedWorkout = null"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              Treino de {{ formatDate(selectedWorkout.date) }}
            </h3>
            <button @click="selectedWorkout = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div 
                :class="getWorkoutTypeClasses(selectedWorkout.type)"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ selectedWorkout.type }}
              </div>
              <div class="text-sm text-gray-600">
                {{ selectedWorkout.duration }} minutos
              </div>
              <div class="text-sm text-gray-500">
                {{ selectedWorkout.exercises.length }} exercícios
              </div>
            </div>
            
            <div v-if="selectedWorkout.notes" class="p-3 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-700">{{ selectedWorkout.notes }}</p>
            </div>
            
            <div class="space-y-3">
              <h4 class="font-medium text-gray-900">Exercícios:</h4>
              <div 
                v-for="exercise in selectedWorkout.exercises"
                :key="exercise.exerciseId"
                class="p-3 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-gray-900">
                    {{ getExerciseName(exercise.exerciseId) }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ exercise.sets.length }} séries
                  </span>
                </div>
                
                <div class="space-y-1">
                  <div 
                    v-for="(set, index) in exercise.sets"
                    :key="index"
                    class="flex items-center space-x-4 text-sm text-gray-600"
                  >
                    <span class="w-8">{{ index + 1 }}ª</span>
                    <span>{{ set.weight }}kg</span>
                    <span>{{ set.reps }} reps</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  :checked="selectedWorkout.completed"
                  @change="toggleWorkoutCompletion(selectedWorkout)"
                  class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span class="text-sm text-gray-700">Marcar como concluído</span>
              </div>
              
              <button 
                @click="editWorkout(selectedWorkout)"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Editar Treino
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format, isToday, isSameDay, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useWorkoutStore } from '../stores/workout'
import type { Workout } from '../stores/workout'

// Props
interface Props {
  workouts: Workout[]
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'editWorkout', workout: Workout): void
}

const emit = defineEmits<Emits>()

// Interfaces para tipagem
interface CalendarDate {
  date: Date
  day: number
  key: string
  workout: Workout | null
  isToday: boolean
  isCurrentMonth: boolean
}

interface WorkoutTypeClasses {
  [key: string]: string
}

const workoutStore = useWorkoutStore()

// Estado do componente
const currentDate = ref(new Date())
const isListView = ref(false)
const filterType = ref('')
const period = ref<'current' | 'previous'>('current')
const selectedWorkout = ref<Workout | null>(null)

// Dias da semana em português
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Computed values
const currentMonthYear = computed(() => {
  return format(currentDate.value, 'MMMM yyyy', { locale: ptBR })
})

const isCurrentMonth = computed(() => {
  return isSameMonth(currentDate.value, new Date())
})

const filteredWorkouts = computed(() => {
  let workouts: Workout[] = props.workouts.length > 0 ? props.workouts : (workoutStore.workouts as Workout[])
  
  if (filterType.value) {
    workouts = workouts.filter((workout: Workout) => workout.type === filterType.value)
  }
  
  return workouts.sort((a: Workout, b: Workout) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const calendarDates = computed((): CalendarDate[] => {
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)
  const days = eachDayOfInterval({ start, end })
  
  // Adicionar dias do mês anterior para completar a primeira semana
  const firstDayOfWeek = start.getDay()
  const daysToAdd = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  
  const allDays: CalendarDate[] = []
  
  // Dias do mês anterior
  for (let i = daysToAdd; i > 0; i--) {
    const date = new Date(start)
    date.setDate(date.getDate() - i)
    allDays.push({
      date,
      day: date.getDate(),
      key: `prev-${date.getTime()}`,
      workout: null,
      isToday: false,
      isCurrentMonth: false
    })
  }
  
  // Dias do mês atual
  days.forEach(date => {
    const workout = filteredWorkouts.value.find((w: Workout) => 
      isSameDay(new Date(w.date), date)
    )
    
    allDays.push({
      date,
      day: date.getDate(),
      key: `current-${date.getTime()}`,
      workout: workout || null,
      isToday: isToday(date),
      isCurrentMonth: true
    })
  })
  
  // Adicionar dias do próximo mês para completar a última semana
  const lastDayOfWeek = end.getDay()
  const daysToAddNext = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek
  
  for (let i = 1; i <= daysToAddNext; i++) {
    const date = new Date(end)
    date.setDate(date.getDate() + i)
    allDays.push({
      date,
      day: date.getDate(),
      key: `next-${date.getTime()}`,
      workout: null,
      isToday: false,
      isCurrentMonth: false
    })
  }
  
  return allDays
})

// Methods
const previousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
}

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
}

const toggleView = () => {
  isListView.value = !isListView.value
}

const setPeriod = (newPeriod: 'current' | 'previous') => {
  period.value = newPeriod
  if (newPeriod === 'current') {
    currentDate.value = new Date()
  } else {
    currentDate.value = subMonths(new Date(), 1)
  }
}

const selectDate = (date: CalendarDate) => {
  if (date.workout) {
    selectedWorkout.value = date.workout
  }
}

const toggleWorkoutCompletion = (workout: Workout) => {
  workout.completed = !workout.completed
  // Aqui você pode emitir um evento ou chamar uma função do store
  console.log(`Treino ${workout.completed ? 'marcado como' : 'desmarcado de'} concluído`)
}

const editWorkout = (workout: Workout) => {
  emit('editWorkout', workout)
  selectedWorkout.value = null
}

const getDateClasses = (date: CalendarDate): string => {
  const classes: string[] = []
  
  if (!date.isCurrentMonth) {
    classes.push('bg-gray-50 text-gray-400')
  } else if (date.isToday) {
    classes.push('bg-primary-50 border-primary-300')
  } else if (date.workout) {
    classes.push('bg-green-50 border-green-300')
  } else {
    classes.push('bg-white hover:bg-gray-50')
  }
  
  return classes.join(' ')
}

const getDateNumberClasses = (date: CalendarDate): string => {
  if (!date.isCurrentMonth) return 'text-gray-400'
  if (date.isToday) return 'text-primary-600 font-bold'
  if (date.workout) return 'text-green-700'
  return 'text-gray-900'
}

const getWorkoutTypeClasses = (type: string): string => {
  const typeClasses: WorkoutTypeClasses = {
    'Push': 'bg-blue-100 text-blue-800',
    'Pull': 'bg-green-100 text-green-800',
    'Legs': 'bg-purple-100 text-purple-800',
    'Upper': 'bg-orange-100 text-orange-800',
    'Lower': 'bg-red-100 text-red-800',
    'Full Body': 'bg-indigo-100 text-indigo-800'
  }
  
  return typeClasses[type] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: Date): string => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
}

const getExerciseName = (exerciseId: string): string => {
  const exercise = (workoutStore.exercises as any[]).find((e: any) => e.id === exerciseId)
  return exercise?.name || 'Exercício desconhecido'
}

// Lifecycle
onMounted(() => {
  // Configurar período inicial
  if (period.value === 'previous') {
    currentDate.value = subMonths(new Date(), 1)
  }
})
</script>

<style scoped>
.calendar-container {
  @apply w-full;
}

.calendar-view {
  @apply w-full;
}

.list-view {
  @apply w-full;
}

/* Responsividade */
@media (max-width: 768px) {
  .calendar-container {
    @apply px-2;
  }
  
  .calendar-grid {
    @apply text-xs;
  }
}
</style>
