<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Biblioteca de Exercícios</h2>
        <p class="text-sm text-gray-600 mt-1">Gerencie seus exercícios por grupo muscular</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button @click="showAddExerciseModal = true" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Novo Exercício
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="card">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar exercícios..."
            class="input-field"
          />
        </div>
        <div class="sm:w-48">
          <select v-model="selectedMuscleGroup" class="input-field">
            <option value="">Todos os grupos</option>
            <option v-for="group in muscleGroups" :key="group" :value="group">
              {{ group }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Exercise Groups -->
    <div class="space-y-6">
      <div
        v-for="[muscleGroup, exercises] in Object.entries(groupedExercises)"
        :key="muscleGroup"
        class="card"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
              <span class="text-sm font-medium text-primary-600">{{ exercises.length }}</span>
            </div>
            {{ muscleGroup }}
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="exercise in exercises"
            :key="exercise.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 group"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {{ exercise.name }}
                </h4>
                <p class="text-sm text-gray-500 capitalize">{{ exercise.type }}</p>
              </div>
              
              <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="viewExerciseHistory(exercise)"
                  class="p-1 text-gray-400 hover:text-primary-600"
                  title="Ver histórico"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
                <button
                  @click="editExercise(exercise)"
                  class="p-1 text-gray-400 hover:text-blue-600"
                  title="Editar"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Exercise Stats -->
            <div class="mt-3 pt-3 border-t border-gray-100">
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Último treino</span>
                <span>{{ getLastWorkoutDate(exercise.id) }}</span>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>Total de séries</span>
                <span>{{ getTotalSets(exercise.id) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="exercises.length === 0" class="text-center py-8">
          <div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p class="text-sm text-gray-600">Nenhum exercício encontrado para {{ muscleGroup }}</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Exercise Modal -->
    <div
      v-if="showAddExerciseModal || editingExercise"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeExerciseModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editingExercise ? 'Editar Exercício' : 'Novo Exercício' }}
            </h3>
            <button @click="closeExerciseModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveExercise" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome do Exercício</label>
              <input
                v-model="exerciseForm.name"
                type="text"
                class="input-field"
                required
                placeholder="Ex: Supino Reto"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Grupo Muscular</label>
              <select v-model="exerciseForm.muscleGroup" class="input-field" required>
                <option value="">Selecione...</option>
                <option value="Peito">Peito</option>
                <option value="Costas">Costas</option>
                <option value="Pernas">Pernas</option>
                <option value="Ombros">Ombros</option>
                <option value="Bíceps">Bíceps</option>
                <option value="Tríceps">Tríceps</option>
                <option value="Abdômen">Abdômen</option>
                <option value="Cardio">Cardio</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select v-model="exerciseForm.type" class="input-field" required>
                <option value="strength">Força</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibilidade</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Instruções (Opcional)</label>
              <textarea
                v-model="exerciseForm.instructions"
                rows="3"
                class="input-field"
                placeholder="Como executar o exercício..."
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeExerciseModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                {{ editingExercise ? 'Salvar' : 'Adicionar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Exercise History Modal -->
    <div
      v-if="showHistoryModal && selectedExercise"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="showHistoryModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              Histórico: {{ selectedExercise.name }}
            </h3>
            <button @click="showHistoryModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="exerciseHistory.length > 0" class="space-y-4">
            <div
              v-for="entry in exerciseHistory"
              :key="`${entry.workoutId}-${entry.exerciseId}`"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-gray-900">
                  {{ format(new Date(entry.date), 'dd/MM/yyyy') }}
                </span>
                <span class="text-xs text-gray-500">{{ entry.sets.length }} séries</span>
              </div>
              
              <div class="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
                <div class="font-medium">Série</div>
                <div class="font-medium">Peso</div>
                <div class="font-medium">Reps</div>
              </div>
              
              <div class="space-y-1">
                <div
                  v-for="(set, index) in entry.sets"
                  :key="index"
                  class="grid grid-cols-3 gap-2 text-sm"
                >
                  <div class="text-gray-600">{{ index + 1 }}ª</div>
                  <div class="font-medium">{{ set.weight }}kg</div>
                  <div class="font-medium">{{ set.reps }} reps</div>
                </div>
              </div>
              
              <div v-if="entry.notes" class="mt-3 text-sm text-gray-700 bg-gray-50 rounded p-2">
                {{ entry.notes }}
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p class="text-gray-600">Nenhum histórico encontrado para este exercício</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useWorkoutStore, type Exercise } from '../stores/workout'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const workoutStore = useWorkoutStore()

const searchTerm = ref('')
const selectedMuscleGroup = ref('')
const showAddExerciseModal = ref(false)
const editingExercise = ref<Exercise | null>(null)
const showHistoryModal = ref(false)
const selectedExercise = ref<Exercise | null>(null)

const exerciseForm = reactive({
  name: '',
  muscleGroup: '',
  type: 'strength' as 'strength' | 'cardio' | 'flexibility',
  instructions: ''
})

// Computed values
const muscleGroups = computed(() => {
  const groups = new Set((workoutStore.exercises as any[]).map((e: any) => e.muscleGroup))
  return Array.from(groups).sort()
})

const filteredExercises = computed(() => {
  let exercises = workoutStore.exercises as any[]
  
  if (searchTerm.value) {
    exercises = exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  
  if (selectedMuscleGroup.value) {
    exercises = exercises.filter(exercise => exercise.muscleGroup === selectedMuscleGroup.value)
  }
  
  return exercises
})

const groupedExercises = computed(() => {
  const groups: Record<string, Exercise[]> = {}
  
  if (selectedMuscleGroup.value) {
    groups[selectedMuscleGroup.value] = filteredExercises.value
  } else {
    filteredExercises.value.forEach(exercise => {
      if (!groups[exercise.muscleGroup]) {
        groups[exercise.muscleGroup] = []
      }
      groups[exercise.muscleGroup].push(exercise)
    })
  }
  
  // Sort exercises within each group
  Object.keys(groups).forEach(group => {
    groups[group].sort((a, b) => a.name.localeCompare(b.name))
  })
  
  return groups
})

const exerciseHistory = computed(() => {
  if (!selectedExercise.value) return []
  return workoutStore.getExerciseHistory(selectedExercise.value.id)
})

// Methods
const getLastWorkoutDate = (exerciseId: string) => {
  const history = workoutStore.getExerciseHistory(exerciseId, 1)
  if (history.length === 0) return 'Nunca'
  
  return format(new Date(history[0].date), 'dd/MM/yy', { locale: ptBR })
}

const getTotalSets = (exerciseId: string) => {
  const history = workoutStore.getExerciseHistory(exerciseId)
  return history.reduce((total, entry) => total + entry.sets.length, 0)
}

const editExercise = (exercise: Exercise) => {
  editingExercise.value = exercise
  exerciseForm.name = exercise.name
  exerciseForm.muscleGroup = exercise.muscleGroup
  exerciseForm.type = exercise.type
  exerciseForm.instructions = exercise.instructions || ''
}

const viewExerciseHistory = (exercise: Exercise) => {
  selectedExercise.value = exercise
  showHistoryModal.value = true
}

const closeExerciseModal = () => {
  showAddExerciseModal.value = false
  editingExercise.value = null
  resetExerciseForm()
}

const resetExerciseForm = () => {
  exerciseForm.name = ''
  exerciseForm.muscleGroup = ''
  exerciseForm.type = 'strength'
  exerciseForm.instructions = ''
}

const saveExercise = () => {
  if (editingExercise.value) {
    // Note: In a real app, you'd have an updateExercise method
    console.log('Update exercise functionality not implemented in this demo')
  } else {
    workoutStore.addExercise({
      name: exerciseForm.name,
      muscleGroup: exerciseForm.muscleGroup,
      type: exerciseForm.type,
      instructions: exerciseForm.instructions || undefined
    })
  }
  
  closeExerciseModal()
}
</script>