<script setup>
import { ref, onMounted } from 'vue'
import Dashboard from '@/components/Dashboard.vue'

const users = ref([])
const loading = ref(true)
const error = ref(null)
const token = localStorage.getItem('token')
onMounted(async () => {
  try {
    const res = await fetch('https://project-rainfall-20113304171.development.catalystserverless.eu/server/project_rainfall_function/api/users', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    })
    const data = await res.json()
    users.value = data.users.users
    console.log(users.value)
  } catch (err) {
    error.value = 'Failed to load applications'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Dashboard>
    <div class="flex items-start justify-center">
      <div v-if="users.length === 0" class="text-center text-gray-400 py-10">
        No applications yet.
      </div>

      <div v-else-if="error" class="text-red-500">{{ error }}</div>

      <div v-else class="overflow-x-auto flex items-start pt-8 justify-center min-h-screen w-fit">
        <table class="w-full text-sm text-left rounded-2xl border-gray-200 overflow-hidden">
          <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Created</th>
              <th class="px-4 py-3">ID</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-t border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 font-medium text-gray-800">
                {{ user.display_name }}
              </td>
              <td class="px-4 py-3 text-gray-600">{{ user.email || 'No email provided' }}</td>
              <td class="px-4 py-3">
                <span
                  :class="
                    user.is_active === true
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  "
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-500">
                {{ new Date(user.added_time).toLocaleDateString() }}
              </td>
              <td class="px-4 py-3 text-gray-500">
                {{ user.id }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Dashboard>
</template>
