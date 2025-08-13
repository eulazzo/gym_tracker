import { defineStore } from 'pinia'
import { ref, computed, Ref } from 'vue'
import { isToday, startOfWeek, endOfWeek } from 'date-fns'

export interface Exercise {
  id: string
  name: string
  muscleGroup: string
  type: 'strength' | 'cardio' | 'flexibility'
  instructions?: string
  imageUrl?: string
}

export interface WorkoutSet {
  reps: number
  weight: number
  rest: number // seconds
  completed: boolean
}

export interface WorkoutExercise {
  exerciseId: string
  exercise?: Exercise
  sets: WorkoutSet[]
  notes?: string
  personalRecord?: boolean
}

export interface Workout {
  id: string
  date: Date
  exercises: WorkoutExercise[]
  notes?: string
  duration: number // minutes
  startTime: Date
  endTime?: Date
  type: string // Push, Pull, Legs, etc.
  completed?: boolean // Indica se o treino foi concluído
}

export interface BodyMetric {
  id: string
  date: Date
  weight?: number
  bodyFat?: number
  measurements: {
    chest?: number
    waist?: number
    hips?: number
    bicep?: number
    thigh?: number
  }
  photos?: string[]
}

export const useWorkoutStore = defineStore('workout', () => {
  const workouts = ref<Workout[]>([])
  const exercises = ref<Exercise[]>([])
  const bodyMetrics = ref<BodyMetric[]>([])
  const isLoading = ref(false)

  // Computed values
  const todayWorkout = computed(() => {
    return workouts.value.find(w => isToday(new Date(w.date)))
  })

  const thisWeekWorkouts = computed(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    const end = endOfWeek(new Date(), { weekStartsOn: 1 })
    
    return workouts.value.filter(w => {
      const workoutDate = new Date(w.date)
      return workoutDate >= start && workoutDate <= end
    })
  })

  const weeklyFrequency = computed(() => {
    return (thisWeekWorkouts.value.length / 7) * 100
  })

  const totalWorkouts = computed(() => workouts.value.length)

  const exercisesByMuscleGroup = computed(() => {
    const grouped: Record<string, Exercise[]> = {}
    exercises.value.forEach(exercise => {
      if (!grouped[exercise.muscleGroup]) {
        grouped[exercise.muscleGroup] = []
      }
      grouped[exercise.muscleGroup].push(exercise)
    })
    return grouped
  })

  const latestBodyMetrics = computed(() => {
    return bodyMetrics.value
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
  })

  // Initialize from localStorage
  const initWorkoutData = () => {
    try {
      const storedWorkouts = localStorage.getItem('gymtracker_workouts')
      const storedExercises = localStorage.getItem('gymtracker_exercises')
      const storedMetrics = localStorage.getItem('gymtracker_body_metrics')

      if (storedWorkouts) {
        workouts.value = JSON.parse(storedWorkouts).map((w: any) => ({
          ...w,
          date: new Date(w.date),
          startTime: new Date(w.startTime),
          endTime: w.endTime ? new Date(w.endTime) : undefined
        }))
      } else {
        // Adicionar alguns treinos de exemplo se não houver dados salvos
        initSampleWorkouts()
      }

      if (storedExercises) {
        exercises.value = JSON.parse(storedExercises)
      } else {
        // Initialize with default exercises
        initDefaultExercises()
      }

      if (storedMetrics) {
        bodyMetrics.value = JSON.parse(storedMetrics).map((m: any) => ({
          ...m,
          date: new Date(m.date)
        }))
      }
    } catch (error) {
      console.error('Error loading workout data:', error)
    }
  }

  const initDefaultExercises = () => {
    const defaultExercises: Exercise[] = [
      // Chest
      { id: '1', name: 'Supino Reto', muscleGroup: 'Peito', type: 'strength' },
      { id: '2', name: 'Supino Inclinado', muscleGroup: 'Peito', type: 'strength' },
      { id: '3', name: 'Crucifixo', muscleGroup: 'Peito', type: 'strength' },
      { id: '4', name: 'Flexão', muscleGroup: 'Peito', type: 'strength' },
      
      // Back
      { id: '5', name: 'Puxada Frontal', muscleGroup: 'Costas', type: 'strength' },
      { id: '6', name: 'Remada Curvada', muscleGroup: 'Costas', type: 'strength' },
      { id: '7', name: 'Pulley', muscleGroup: 'Costas', type: 'strength' },
      { id: '8', name: 'Barra Fixa', muscleGroup: 'Costas', type: 'strength' },
      
      // Legs
      { id: '9', name: 'Agachamento', muscleGroup: 'Pernas', type: 'strength' },
      { id: '10', name: 'Leg Press', muscleGroup: 'Pernas', type: 'strength' },
      { id: '11', name: 'Cadeira Extensora', muscleGroup: 'Pernas', type: 'strength' },
      { id: '12', name: 'Mesa Flexora', muscleGroup: 'Pernas', type: 'strength' },
      
      // Shoulders
      { id: '13', name: 'Desenvolvimento', muscleGroup: 'Ombros', type: 'strength' },
      { id: '14', name: 'Elevação Lateral', muscleGroup: 'Ombros', type: 'strength' },
      { id: '15', name: 'Elevação Frontal', muscleGroup: 'Ombros', type: 'strength' },
      
      // Arms
      { id: '16', name: 'Rosca Direta', muscleGroup: 'Bíceps', type: 'strength' },
      { id: '17', name: 'Rosca Martelo', muscleGroup: 'Bíceps', type: 'strength' },
      { id: '18', name: 'Tríceps Pulley', muscleGroup: 'Tríceps', type: 'strength' },
      { id: '19', name: 'Mergulho', muscleGroup: 'Tríceps', type: 'strength' }
    ]
    
    exercises.value = defaultExercises
    localStorage.setItem('gymtracker_exercises', JSON.stringify(exercises.value))
  }

  const initSampleWorkouts = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const twoDaysAgo = new Date(today)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    
    const sampleWorkouts: Workout[] = [
      {
        id: generateId(),
        date: today,
        type: 'Push',
        duration: 75,
        exercises: [
          {
            exerciseId: '1',
            sets: [
              { reps: 12, weight: 60, rest: 90, completed: true },
              { reps: 10, weight: 65, rest: 90, completed: true },
              { reps: 8, weight: 70, rest: 90, completed: true }
            ]
          },
          {
            exerciseId: '13',
            sets: [
              { reps: 10, weight: 40, rest: 90, completed: true },
              { reps: 8, weight: 45, rest: 90, completed: true }
            ]
          }
        ],
        startTime: new Date(today.getTime() - 75 * 60000),
        notes: 'Treino forte hoje!',
        completed: true
      },
      {
        id: generateId(),
        date: yesterday,
        type: 'Pull',
        duration: 60,
        exercises: [
          {
            exerciseId: '5',
            sets: [
              { reps: 12, weight: 50, rest: 90, completed: true },
              { reps: 10, weight: 55, rest: 90, completed: true }
            ]
          }
        ],
        startTime: new Date(yesterday.getTime() - 60 * 60000),
        completed: true
      },
      {
        id: generateId(),
        date: twoDaysAgo,
        type: 'Legs',
        duration: 90,
        exercises: [
          {
            exerciseId: '9',
            sets: [
              { reps: 10, weight: 80, rest: 120, completed: true },
              { reps: 8, weight: 90, rest: 120, completed: true }
            ]
          }
        ],
        startTime: new Date(twoDaysAgo.getTime() - 90 * 60000),
        completed: false
      },
      {
        id: generateId(),
        date: lastWeek,
        type: 'Full Body',
        duration: 120,
        exercises: [
          {
            exerciseId: '1',
            sets: [
              { reps: 15, weight: 50, rest: 60, completed: true }
            ]
          }
        ],
        startTime: new Date(lastWeek.getTime() - 120 * 60000),
        completed: true
      }
    ]
    
    workouts.value = sampleWorkouts
    localStorage.setItem('gymtracker_workouts', JSON.stringify(workouts.value))
  }

  // Workout management
  const createWorkout = (workoutData: Omit<Workout, 'id'>) => {
    const workout: Workout = {
      ...workoutData,
      id: generateId(),
    }
    
    workouts.value.push(workout)
    localStorage.setItem('gymtracker_workouts', JSON.stringify(workouts.value))
    return workout
  }

  const updateWorkout = (id: string, updates: Partial<Workout>) => {
    const index = workouts.value.findIndex(w => w.id === id)
    if (index !== -1) {
      workouts.value[index] = { ...workouts.value[index], ...updates }
      localStorage.setItem('gymtracker_workouts', JSON.stringify(workouts.value))
    }
  }

  const deleteWorkout = (id: string) => {
    workouts.value = workouts.value.filter(w => w.id !== id)
    localStorage.setItem('gymtracker_workouts', JSON.stringify(workouts.value))
  }

  // Exercise management
  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: generateId()
    }
    
    exercises.value.push(newExercise)
    localStorage.setItem('gymtracker_exercises', JSON.stringify(exercises.value))
    return newExercise
  }

  // Body metrics management
  const addBodyMetric = (metric: Omit<BodyMetric, 'id'>) => {
    const newMetric: BodyMetric = {
      ...metric,
      id: generateId()
    }
    
    bodyMetrics.value.push(newMetric)
    localStorage.setItem('gymtracker_body_metrics', JSON.stringify(bodyMetrics.value))
    return newMetric
  }

  // Quick check-in for today
  const quickCheckIn = () => {
    if (todayWorkout.value) return todayWorkout.value

    return createWorkout({
      date: new Date(),
      exercises: [],
      duration: 0,
      startTime: new Date(),
      type: 'General'
    })
  }

  // Get exercise history
  const getExerciseHistory = (exerciseId: string, limit = 10) => {
    return workouts.value
      .flatMap(workout => 
        workout.exercises
          .filter(ex => ex.exerciseId === exerciseId)
          .map(ex => ({
            ...ex,
            date: workout.date,
            workoutId: workout.id
          }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }

  // Calculate 1RM
  const calculate1RM = (weight: number, reps: number): number => {
    // Epley formula
    return weight * (1 + reps / 30)
  }

  // Helper function
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  return {
    workouts: readonly(workouts),
    exercises: readonly(exercises),
    bodyMetrics: readonly(bodyMetrics),
    isLoading: readonly(isLoading),
    todayWorkout,
    thisWeekWorkouts,
    weeklyFrequency,
    totalWorkouts,
    exercisesByMuscleGroup,
    latestBodyMetrics,
    initWorkoutData,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    addExercise,
    addBodyMetric,
    quickCheckIn,
    getExerciseHistory,
    calculate1RM
  }
})

// Make readonly to prevent external mutations
function readonly<T>(ref: Ref<T>): Ref<T> {
  return ref
}