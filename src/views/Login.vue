<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 animate-fade-in">
          <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 animate-slide-up">GymTracker</h2>
        <p class="mt-2 text-sm text-gray-600 animate-slide-up">
          {{ isLogin ? 'Entre na sua conta' : 'Crie sua conta gratuita' }}
        </p>
      </div>

      <div class="glass-card max-w-md w-full animate-slide-up">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div v-if="!isLogin">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nome completo
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="input-field"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pr-10"
                :placeholder="isLogin ? 'Sua senha' : 'Mínimo 6 caracteres'"
                :minlength="isLogin ? 1 : 6"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPassword = !showPassword"
              >
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="!!authStore.isLoading"
              class="w-full btn-primary h-12 text-base font-semibold relative overflow-hidden"
            >
              <span v-if="!authStore.isLoading">
                {{ isLogin ? 'Entrar' : 'Criar conta' }}
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isLogin ? 'Entrando...' : 'Criando conta...' }}
              </span>
            </button>
          </div>

          <div class="text-center">
            <button
              type="button"
              class="text-sm text-primary-600 hover:text-primary-500 font-medium"
              @click="toggleMode"
            >
              {{ isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Demo credentials -->
      <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="text-center">
          <h3 class="text-sm font-medium text-yellow-800 mb-2">Conta de Demonstração</h3>
          <p class="text-xs text-yellow-700 mb-3">Use essas credenciais para testar o sistema:</p>
          <div class="space-y-1 text-xs">
            <div class="font-mono bg-yellow-100 px-2 py-1 rounded">demo@gymtracker.com</div>
            <div class="font-mono bg-yellow-100 px-2 py-1 rounded">demo123</div>
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

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const showPassword = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  password: ''
})

// Create demo account on first load
const createDemoAccount = () => {
  const storedUsers = JSON.parse(localStorage.getItem('gymtracker_users') || '[]')
  const demoExists = storedUsers.find((u: any) => u.email === 'demo@gymtracker.com')
  
  if (!demoExists) {
    const demoUser = {
      id: 'demo-user',
      name: 'Usuário Demo',
      email: 'demo@gymtracker.com',
      password: 'demo123',
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
    
    storedUsers.push(demoUser)
    localStorage.setItem('gymtracker_users', JSON.stringify(storedUsers))
  }
}

// Initialize demo account
createDemoAccount()

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  form.name = ''
  form.email = ''
  form.password = ''
}

const handleSubmit = async () => {
  error.value = ''
  
  try {
    let result
    
    if (isLogin.value) {
      result = await authStore.login(form.email, form.password)
    } else {
      if (!form.name.trim()) {
        error.value = 'Nome é obrigatório'
        return
      }
      result = await authStore.register(form.name, form.email, form.password)
    }
    
    if (result.success) {
      router.push('/')
    } else {
      error.value = result.error || 'Erro desconhecido'
    }
  } catch (err) {
    error.value = 'Erro interno. Tente novamente.'
  }
}
</script>