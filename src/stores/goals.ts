import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Goal {
  id: string
  title: string
  description: string
  category: 'strength' | 'weight' | 'endurance' | 'flexibility' | 'muscle' | 'other'
  targetValue: number
  currentValue: number
  unit: string
  deadline: Date
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  milestones: Milestone[]
  notes?: string
}

export interface Milestone {
  id: string
  title: string
  targetValue: number
  currentValue: number
  completed: boolean
  deadline: Date
}

export const useGoalsStore = defineStore('goals', () => {
  const goals = ref<Goal[]>([])
  const isLoading = ref(false)

  // Computed properties
  const activeGoals = computed(() => 
    goals.value.filter(goal => goal.status === 'active')
  )
  
  const completedGoals = computed(() => 
    goals.value.filter(goal => goal.status === 'completed')
  )
  
  const goalsByCategory = computed(() => {
    const grouped = goals.value.reduce((acc, goal) => {
      if (!acc[goal.category]) {
        acc[goal.category] = []
      }
      acc[goal.category].push(goal)
      return acc
    }, {} as Record<string, Goal[]>)
    
    return grouped
  })

  const goalsProgress = computed(() => {
    if (goals.value.length === 0) return 0
    
    const totalProgress = goals.value.reduce((sum, goal) => {
      if (goal.status === 'completed') return sum + 100
      if (goal.status === 'cancelled') return sum
      
      const progress = Math.min(100, (goal.currentValue / goal.targetValue) * 100)
      return sum + progress
    }, 0)
    
    return Math.round(totalProgress / goals.value.length)
  })

  // Actions
  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    goals.value.push(newGoal)
    saveGoals()
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const goalIndex = goals.value.findIndex(goal => goal.id === id)
    if (goalIndex !== -1) {
      goals.value[goalIndex] = {
        ...goals.value[goalIndex],
        ...updates,
        updatedAt: new Date()
      }
      saveGoals()
    }
  }

  const deleteGoal = (id: string) => {
    goals.value = goals.value.filter(goal => goal.id !== id)
    saveGoals()
  }

  const updateGoalProgress = (id: string, currentValue: number) => {
    const goal = goals.value.find(g => g.id === id)
    if (goal) {
      goal.currentValue = currentValue
      goal.updatedAt = new Date()
      
      // Check if goal is completed
      if (currentValue >= goal.targetValue && goal.status === 'active') {
        goal.status = 'completed'
      }
      
      saveGoals()
    }
  }

  const addMilestone = (goalId: string, milestoneData: Omit<Milestone, 'id'>) => {
    const goal = goals.value.find(g => g.id === goalId)
    if (goal) {
      const newMilestone: Milestone = {
        ...milestoneData,
        id: generateId()
      }
      goal.milestones.push(newMilestone)
      goal.updatedAt = new Date()
      saveGoals()
    }
  }

  const updateMilestone = (goalId: string, milestoneId: string, updates: Partial<Milestone>) => {
    const goal = goals.value.find(g => g.id === goalId)
    if (goal) {
      const milestoneIndex = goal.milestones.findIndex(m => m.id === milestoneId)
      if (milestoneIndex !== -1) {
        goal.milestones[milestoneIndex] = {
          ...goal.milestones[milestoneIndex],
          ...updates
        }
        goal.updatedAt = new Date()
        saveGoals()
      }
    }
  }

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.value.find(g => g.id === goalId)
    if (goal) {
      goal.milestones = goal.milestones.filter(m => m.id !== milestoneId)
      goal.updatedAt = new Date()
      saveGoals()
    }
  }

  // Persistence
  const saveGoals = () => {
    localStorage.setItem('gymtracker_goals', JSON.stringify(goals.value))
  }

  const loadGoals = () => {
    const stored = localStorage.getItem('gymtracker_goals')
    if (stored) {
      goals.value = JSON.parse(stored).map((g: any) => ({
        ...g,
        deadline: new Date(g.deadline),
        createdAt: new Date(g.createdAt),
        updatedAt: new Date(g.updatedAt),
        milestones: g.milestones?.map((m: any) => ({
          ...m,
          deadline: new Date(m.deadline)
        })) || []
      }))
    } else {
      initSampleGoals()
    }
  }

  const initSampleGoals = () => {
    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextQuarter = new Date(today)
    nextQuarter.setMonth(nextQuarter.getMonth() + 3)

    const sampleGoals: Goal[] = [
      {
        id: generateId(),
        title: 'Aumentar Força no Supino',
        description: 'Melhorar a força máxima no exercício de supino reto',
        category: 'strength',
        targetValue: 100,
        currentValue: 70,
        unit: 'kg',
        deadline: nextMonth,
        status: 'active',
        createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        milestones: [
          {
            id: generateId(),
            title: 'Alcançar 80kg',
            targetValue: 80,
            currentValue: 70,
            completed: false,
            deadline: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)
          },
          {
            id: generateId(),
            title: 'Alcançar 90kg',
            targetValue: 90,
            currentValue: 70,
            completed: false,
            deadline: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
          }
        ],
        notes: 'Focar em técnica e progressão gradual'
      },
      {
        id: generateId(),
        title: 'Perder Peso',
        description: 'Reduzir o peso corporal para melhorar a saúde e performance',
        category: 'weight',
        targetValue: 75,
        currentValue: 82,
        unit: 'kg',
        deadline: nextQuarter,
        status: 'active',
        createdAt: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        milestones: [
          {
            id: generateId(),
            title: 'Chegar a 80kg',
            targetValue: 80,
            currentValue: 82,
            completed: false,
            deadline: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
          }
        ],
        notes: 'Combinar treino com dieta equilibrada'
      },
      {
        id: generateId(),
        title: 'Correr 10km',
        description: 'Completar uma corrida de 10km em menos de 50 minutos',
        category: 'endurance',
        targetValue: 50,
        currentValue: 0,
        unit: 'minutos',
        deadline: nextQuarter,
        status: 'active',
        createdAt: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        milestones: [
          {
            id: generateId(),
            title: 'Correr 5km',
            targetValue: 5,
            currentValue: 0,
            completed: false,
            deadline: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
          }
        ],
        notes: 'Treinar 3x por semana, aumentando gradualmente a distância'
      }
    ]

    goals.value = sampleGoals
    saveGoals()
  }

  // Utility function
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Initialize store
  loadGoals()

  return {
    // State
    goals,
    isLoading,
    
    // Computed
    activeGoals,
    completedGoals,
    goalsByCategory,
    goalsProgress,
    
    // Actions
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    
    // Persistence
    saveGoals,
    loadGoals
  }
})
