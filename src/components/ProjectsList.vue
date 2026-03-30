<script setup>
import { ref, onMounted, watch } from 'vue'

const projects = ref([])
const loading = ref(true)
const error = ref(null)

const projectsList = async () => {
  try {
    const res = await fetch('https://project-rainfall-20113304171.development.catalystserverless.eu/api/projects', {
      method: 'GET',
    })
    const data = await res.json()
    projects.value = data.projects
    console.log(projects.value)
  } catch (err) {
    error.value = 'Failed to load applications'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  projectsList()
})

defineExpose({ reload: projectsList })
</script>

<template>
  <div class="flex items-center justify-center">
    <div v-if="projects.length === 0" class="text-center text-gray-400 py-10">
      Nothing to display.
    </div>

    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else class="overflow-x-auto">
      <table class=" text-sm text-left rounded-2xl border-gray-200 overflow-hidden">
        <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th class="px-4 py-3">Project Name</th>
            <th class="px-4 py-3">Complete %</th>
            <th class="px-4 py-3">Owner</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">ID</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="project in projects"
            :key="project.id"
            class="border-t border-gray-200 hover:bg-gray-50 transition"
          >
            <td class="px-4 py-3 font-medium text-gray-800">
              {{ project.name }}
            </td>
            <td class="px-4 py-3 text-gray-600">{{ project.percent_complete }}</td>
            <td class="px-4 py-3 text-gray-600">{{ project.owner.email || 'No email provided' }}</td>
            <td class="px-4 py-3">
                <span
                    :class="
                    project.project_type === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  "
                    class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ project.is_active ? 'Active' : 'Inactive' }}
                </span>
            </td>

            <td class="px-4 py-3 text-gray-500">
              {{ project.id }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
