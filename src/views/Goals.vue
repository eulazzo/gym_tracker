<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Metas e Objetivos</h1>
        <p class="text-gray-600">Acompanhe seu progresso e defina novas metas</p>
      </div>
      <button
        @click="showAddGoalModal = true"
        class="btn-primary"
      >
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nova Meta
      </button>
    </div>

    <!-- Progress Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card text-center">
        <div class="text-3xl font-bold text-primary-600">{{ goalsStore.goals.length }}</div>
        <div class="text-sm text-gray-600">Total de Metas</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl font-bold text-secondary-600">{{ goalsStore.activeGoals.length }}</div>
        <div class="text-sm text-gray-600">Metas Ativas</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl font-bold text-accent-600">{{ goalsStore.completedGoals.length }}</div>
        <div class="text-sm text-gray-600">Metas Concluídas</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl font-bold text-green-600">{{ goalsStore.goalsProgress }}%</div>
        <div class="text-sm text-gray-600">Progresso Geral</div>
      </div>
    </div>

    <!-- Filters and Tabs -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="activeTab === tab.value ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300'"
          class="px-4 py-2 rounded-lg transition-colors"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="flex items-center space-x-2">
        <select
          v-model="filterCategory"
          class="input-field w-40"
        >
          <option value="">Todas as Categorias</option>
          <option value="strength">Força</option>
          <option value="weight">Peso</option>
          <option value="endurance">Resistência</option>
          <option value="flexibility">Flexibilidade</option>
          <option value="muscle">Músculo</option>
          <option value="other">Outros</option>
        </select>
      </div>
    </div>

    <!-- Goals List -->
    <div class="space-y-4">
      <div
        v-for="goal in filteredGoals"
        :key="goal.id"
        class="card hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ goal.title }}</h3>
              <span
                :class="getStatusClass(goal.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ getStatusLabel(goal.status) }}
              </span>
              <span
                :class="getCategoryClass(goal.category)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ getCategoryLabel(goal.category) }}
              </span>
            </div>
            
            <p class="text-gray-600 mb-3">{{ goal.description }}</p>
            
            <!-- Progress Bar -->
            <div class="mb-3">
              <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progresso: {{ goal.currentValue }}{{ goal.unit }} / {{ goal.targetValue }}{{ goal.unit }}</span>
                <span>{{ Math.round((goal.currentValue / goal.targetValue) * 100) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  :class="getProgressColor(goal)"
                  class="h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%` }"
                ></div>
              </div>
            </div>
            
            <!-- Deadline -->
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Prazo: {{ formatDate(goal.deadline) }}</span>
            </div>
            
            <!-- Milestones -->
            <div v-if="goal.milestones.length > 0" class="mb-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Marcos:</h4>
              <div class="space-y-1">
                <div
                  v-for="milestone in goal.milestones"
                  :key="milestone.id"
                  class="flex items-center space-x-2 text-sm"
                >
                  <input
                    type="checkbox"
                    :checked="milestone.completed"
                    @change="toggleMilestone(goal.id, milestone.id)"
                    class="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span
                    :class="milestone.completed ? 'line-through text-gray-400' : 'text-gray-600'"
                  >
                    {{ milestone.title }} ({{ milestone.currentValue }}{{ goal.unit }} / {{ milestone.targetValue }}{{ goal.unit }})
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Notes -->
            <div v-if="goal.notes" class="text-sm text-gray-500 italic">
              "{{ goal.notes }}"
            </div>
          </div>
          
          <div class="flex items-center space-x-2 ml-4">
            <button
              @click="editGoal(goal)"
              class="btn-ghost p-2"
              title="Editar"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteGoal(goal.id)"
              class="btn-ghost p-2 text-red-600 hover:text-red-700"
              title="Excluir"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="filteredGoals.length === 0" class="card text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma meta encontrada</h3>
        <p class="text-gray-600">Comece criando sua primeira meta para acompanhar seu progresso!</p>
      </div>
    </div>

    <!-- Add/Edit Goal Modal -->
    <div
      v-if="showAddGoalModal || editingGoal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          {{ editingGoal ? 'Editar Meta' : 'Nova Meta' }}
        </h2>
        
        <form @submit.prevent="saveGoal" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                v-model="goalForm.title"
                type="text"
                required
                class="input-field"
                placeholder="Ex: Aumentar força no supino"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                v-model="goalForm.category"
                required
                class="input-field"
              >
                <option value="strength">Força</option>
                <option value="weight">Peso</option>
                <option value="endurance">Resistência</option>
                <option value="flexibility">Flexibilidade</option>
                <option value="muscle">Músculo</option>
                <option value="other">Outros</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              v-model="goalForm.description"
              required
              rows="3"
              class="input-field"
              placeholder="Descreva sua meta em detalhes..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Valor Atual</label>
              <input
                v-model.number="goalForm.currentValue"
                type="number"
                required
                step="0.1"
                class="input-field"
                placeholder="0"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Valor Alvo</label>
              <input
                v-model.number="goalForm.targetValue"
                type="number"
                required
                step="0.1"
                class="input-field"
                placeholder="100"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
              <input
                v-model="goalForm.unit"
                type="text"
                required
                class="input-field"
                placeholder="kg, km, min"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
            <input
              v-model="goalForm.deadline"
              type="date"
              required
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="goalForm.status"
              required
              class="input-field"
            >
              <option value="active">Ativa</option>
              <option value="paused">Pausada</option>
              <option value="completed">Concluída</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              v-model="goalForm.notes"
              rows="2"
              class="input-field"
              placeholder="Observações adicionais..."
            ></textarea>
          </div>
          
          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn-primary"
            >
              {{ editingGoal ? 'Atualizar' : 'Criar' }} Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGoalsStore, type Goal } from '../stores/goals'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const goalsStore = useGoalsStore()

// State
const activeTab = ref<'all' | 'active' | 'completed'>('all')
const filterCategory = ref<string>('')
const showAddGoalModal = ref(false)
const editingGoal = ref<Goal | null>(null)

// Form data
const goalForm = ref({
  title: '',
  description: '',
  category: 'strength' as Goal['category'],
  targetValue: 0,
  currentValue: 0,
  unit: '',
  deadline: '',
  status: 'active' as Goal['status'],
  notes: ''
})

// Computed
const tabs = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Ativas' },
  { value: 'completed', label: 'Concluídas' }
] as const

const filteredGoals = computed(() => {
  let filtered = goalsStore.goals

  // Filter by tab
  if (activeTab.value === 'active') {
    filtered = filtered.filter(goal => goal.status === 'active')
  } else if (activeTab.value === 'completed') {
    filtered = filtered.filter(goal => goal.status === 'completed')
  }

  // Filter by category
  if (filterCategory.value) {
    filtered = filtered.filter(goal => goal.category === filterCategory.value)
  }

  return filtered
})

// Methods
const editGoal = (goal: Goal) => {
  editingGoal.value = goal
  goalForm.value = {
    title: goal.title,
    description: goal.description,
    category: goal.category,
    targetValue: goal.targetValue,
    currentValue: goal.currentValue,
    unit: goal.unit,
    deadline: format(goal.deadline, 'yyyy-MM-dd'),
    status: goal.status,
    notes: goal.notes || ''
  }
}

const saveGoal = () => {
  if (editingGoal.value) {
    goalsStore.updateGoal(editingGoal.value.id, {
      ...goalForm.value,
      deadline: new Date(goalForm.value.deadline)
    })
  } else {
    goalsStore.addGoal({
      ...goalForm.value,
      deadline: new Date(goalForm.value.deadline),
      milestones: []
    })
  }
  
  closeModal()
}

const deleteGoal = (id: string) => {
  if (confirm('Tem certeza que deseja excluir esta meta?')) {
    goalsStore.deleteGoal(id)
  }
}

const toggleMilestone = (goalId: string, milestoneId: string) => {
  const goal = goalsStore.goals.find(g => g.id === goalId)
  if (goal) {
    const milestone = goal.milestones.find(m => m.id === milestoneId)
    if (milestone) {
      goalsStore.updateMilestone(goalId, milestoneId, {
        completed: !milestone.completed
      })
    }
  }
}

const closeModal = () => {
  showAddGoalModal.value = false
  editingGoal.value = null
  goalForm.value = {
    title: '',
    description: '',
    category: 'strength',
    targetValue: 0,
    currentValue: 0,
    unit: '',
    deadline: '',
    status: 'active',
    notes: ''
  }
}

const getStatusClass = (status: Goal['status']) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    paused: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status]
}

const getStatusLabel = (status: Goal['status']) => {
  const labels = {
    active: 'Ativa',
    completed: 'Concluída',
    paused: 'Pausada',
    cancelled: 'Cancelada'
  }
  return labels[status]
}

const getCategoryClass = (category: Goal['category']) => {
  const classes = {
    strength: 'bg-red-100 text-red-800',
    weight: 'bg-purple-100 text-purple-800',
    endurance: 'bg-blue-100 text-blue-800',
    flexibility: 'bg-green-100 text-green-800',
    muscle: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800'
  }
  return classes[category]
}

const getCategoryLabel = (category: Goal['category']) => {
  const labels = {
    strength: 'Força',
    weight: 'Peso',
    endurance: 'Resistência',
    flexibility: 'Flexibilidade',
    muscle: 'Músculo',
    other: 'Outros'
  }
  return labels[category]
}

const getProgressColor = (goal: Goal) => {
  const progress = (goal.currentValue / goal.targetValue) * 100
  
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 60) return 'bg-blue-500'
  if (progress >= 40) return 'bg-yellow-500'
  if (progress >= 20) return 'bg-orange-500'
  return 'bg-red-500'
}

const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

onMounted(() => {
  // Initialize store if needed
  if (goalsStore.goals.length === 0) {
    goalsStore.loadGoals()
  }
})
</script>
