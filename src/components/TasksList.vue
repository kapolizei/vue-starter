<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  projectId: { type: String, required: true }
})

const tasks = ref([])
const loading = ref(false)
const error = ref(null)

const loadTasks = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`https://project-rainfall-20113304171.development.catalystserverless.eu/api/tasks/${props.projectId}`)
    const data = await res.json()
    tasks.value = data.tasks.tasks || []
  } catch {
    error.value = 'Failed to load tasks'
  } finally {
    loading.value = false
  }
}

watch(() => props.projectId, loadTasks, { immediate: true })

defineExpose({ reload: loadTasks })
</script>

<template>
  <div>
    <div v-if="loading" class="text-gray-400 text-center py-10">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="tasks.length === 0" class="text-center text-gray-400 py-10">
      No tasks yet.
    </div>
    <div v-else class="overflow-x-auto">
      <table class="text-sm text-left rounded-2xl border-gray-200 overflow-hidden w-full">
        <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
        <tr>
          <th class="px-4 py-3">Task Name</th>
          <th class="px-4 py-3">Complete %</th>
          <th class="px-4 py-3">Prefix</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3">ID</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="task in tasks"
            :key="task.id"
            class="border-t border-gray-200 hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-800">{{ task.name }}</td>
          <td class="px-4 py-3 text-gray-600">{{ task.completion_percentage }}</td>
          <td class="px-4 py-3 text-gray-600">{{ task.prefix }}</td>
          <td class="px-4 py-3">
              <span
                  :class="task.status.name === 'Open' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                  class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ task.status.name ? 'Active' : 'Inactive' }}
              </span>
          </td>
          <td class="px-4 py-3 text-gray-500">{{ task.id }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>