<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const API = 'http://localhost:3000'
const mode = ref('login')
const loading = ref(false)
const auth = ref(false)
const serverError = ref('')
const success = ref('')
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

function switchMode(m) {
  mode.value = m
  serverError.value = ''
  success.value = ''
  errors.email = ''
  errors.password = ''
}

function validate() {
  let ok = true
  if (!form.email) {
    errors.email = 'Введите email'
    ok = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Некорректный email'
    ok = false
  }
  if (!form.password) {
    errors.password = 'Введите пароль'
    ok = false
  } else if (form.password.length < 6) {
    errors.password = 'Минимум 6 символов'
    ok = false
  }
  return ok
}

async function submit() {
  serverError.value = ''
  success.value = ''
  if (!validate()) return
  loading.value = true
  try {
    const res = await fetch(`${API}/api/${mode.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password }),
    })
    const data = await res.json()
    if (!res.ok) {
      serverError.value = data.error || 'Ошибка'
      return
    }
    if (mode.value === 'login') {
      localStorage.setItem('token', data.token)
      success.value = 'Вход выполнен!'
      router.push('/dashboard')
    } else {
      success.value = 'Аккаунт создан!'
      switchMode('login')
    }
  } catch {
    serverError.value = 'Сервер недоступен'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="w-full max-w-sm p-8">
        
      <div class="flex border-b border-gray-200 mb-8">
        <button
          v-for="m in ['login', 'register']"
          :key="m"
          @click="switchMode(m)"
          class="pb-3 mr-6 text-sm font-medium transition-colors border-b-2 -mb-px"
          :class="
            mode === m
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          "
        >
          {{ m === 'login' ? 'Вход' : 'Регистрация' }}
        </button>
      </div>

      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm text-gray-500">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            @input="errors.email = ''"
            class="border rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-colors"
            :class="errors.email ? 'border-red-400' : 'border-gray-200'"
          />
          <p v-if="errors.email" class="text-xs text-red-400">{{ errors.email }}</p>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm text-gray-500">Пароль</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            @input="errors.password = ''"
            class="border rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-colors"
            :class="errors.password ? 'border-red-400' : 'border-gray-200'"
          />
          <p v-if="errors.password" class="text-xs text-red-400">{{ errors.password }}</p>
        </div>

        <p v-if="serverError" class="text-xs text-red-400">{{ serverError }}</p>
        <p v-if="success" class="text-xs text-green-500">{{ success }}</p>

        <button
          @click="submit"
          :disabled="loading"
          class="bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
        >
          {{ loading ? '...' : mode === 'login' ? 'Войти' : 'Создать аккаунт' }}
        </button>
      </div>
    </div>
  </div>
</template>
