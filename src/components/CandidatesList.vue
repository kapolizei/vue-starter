<script setup>
import { ref, onMounted } from 'vue'
import Dashboard from '@/components/Dashboard.vue'

const candidates = ref([])
const loading = ref(true)
const error = ref(null)
const token = localStorage.getItem('token')
onMounted(async () => {
  try {
    const res = await fetch('https://project-rainfall-20113304171.development.catalystserverless.eu/server/project_rainfall_function/api/candidates', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    })
    const data = await res.json()
    candidates.value = data
    console.log(candidates.value)
  } catch (err) {
    error.value = 'Failed to load applications'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Dashboard>
    <div class="p-6">
      <div v-if="loading" class="text-gray-500">Loading...</div>

      <div v-if="candidates.length === 0" class="text-center text-gray-400 py-10">
        No applications yet.
      </div>

      <div v-else-if="error" class="text-red-500">{{ error }}</div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left rounded-2xl border-gray-200 overflow-hidden">
          <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Stage</th>
            <th class="px-4 py-3">Created</th>
            <th class="px-4 py-3">ID</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="candidate in candidates"
              :key="candidate.id"
              class="border-t border-gray-200 hover:bg-gray-50 transition"
          >
            <td class="px-4 py-3 font-medium text-gray-800">
              {{ candidate.first_name + ' ' + candidate.last_name }}
            </td>
            <td class="px-4 py-3 text-gray-600">{{ candidate.email || 'No email provided' }}</td>
            <td class="px-4 py-3">
                <span
                    :class="
                    candidate.status === 'sent'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  "
                    class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ candidate.status }}
                </span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ candidate.stage }}</td>
            <td class="px-4 py-3 text-gray-500">
              {{ new Date(candidate.created_at).toLocaleDateString() }}
            </td>
            <td class="px-4 py-3 text-gray-500">
              {{ candidate.zoho_candidate_id }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Dashboard>
</template>
