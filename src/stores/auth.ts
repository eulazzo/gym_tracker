import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: {
    theme: 'light' | 'dark'
    weekStartsOn: 0 | 1 // 0 = Sunday, 1 = Monday
    defaultRestTime: number
    units: 'metric' | 'imperial'
  }
  goals: {
    weeklyWorkouts: number
    targetWeight?: number
    targetBodyFat?: number
  }
  createdAt: Date
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  // Initialize user from localStorage
  const initAuth = () => {
    const storedUser = localStorage.getItem('gymtracker_user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('gymtracker_user')
      }
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check stored users
      const storedUsers = JSON.parse(localStorage.getItem('gymtracker_users') || '[]')
      const existingUser = storedUsers.find((u: any) => u.email === email)
      
      if (!existingUser) {
        return { success: false, error: 'Email não encontrado' }
      }
      
      if (existingUser.password !== password) {
        return { success: false, error: 'Senha incorreta' }
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = existingUser
      user.value = userWithoutPassword
      
      localStorage.setItem('gymtracker_user', JSON.stringify(user.value))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem('gymtracker_users') || '[]')
      const existingUser = storedUsers.find((u: any) => u.email === email)
      
      if (existingUser) {
        return { success: false, error: 'Email já cadastrado' }
      }
      
      // Create new user
      const newUser: User & { password: string } = {
        id: generateId(),
        name,
        email,
        password,
        preferences: {
          theme: 'light',
          weekStartsOn: 1,
          defaultRestTime: 90,
          units: 'metric'
        },
        goals: {
          weeklyWorkouts: 4
        },
        createdAt: new Date()
      }
      
      // Store user with password
      storedUsers.push(newUser)
      localStorage.setItem('gymtracker_users', JSON.stringify(storedUsers))
      
      // Set current user without password
      const { password: _, ...userWithoutPassword } = newUser
      user.value = userWithoutPassword
      localStorage.setItem('gymtracker_user', JSON.stringify(user.value))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('gymtracker_user')
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!user.value) return
    
    user.value = { ...user.value, ...updates }
    localStorage.setItem('gymtracker_user', JSON.stringify(user.value))
  }

  // Helper function to generate unique IDs
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    isAuthenticated,
    initAuth,
    login,
    register,
    logout,
    updateProfile
  }
})

// Make readonly to prevent external mutations
function readonly<T>(ref: Ref<T>): Ref<T> {
  return ref
}