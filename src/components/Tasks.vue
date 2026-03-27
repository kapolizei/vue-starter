<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import Dashboard from '@/components/Dashboard.vue'
import TasksList from '@/components/TasksList.vue'

const toast = useToast()
const projects = ref([])
const selectedProjectId = ref('')
const errors = ref({})
const form = ref({ task_name: '' })
const tasksListRef = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/server/project_rainfall_function/api/projects')
    const data = await res.json()
    projects.value = data.projects || []
  } catch {
    toast.error('Failed to load projects')
  }
})

const validate = () => {
  errors.value = {}
  if (!selectedProjectId.value) errors.value.project = 'Please select a project'
  if (!form.value.task_name || form.value.task_name.length < 2)
    errors.value.task_name = 'Task name is required'
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return
  try {
    const res = await fetch(`https://project-rainfall-20113304171.development.catalystserverless.eu/server/project_rainfall_function/api/tasks/${selectedProjectId.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.value.task_name }),
    })
    if (!res.ok) throw new Error('Failed to create task')
    toast.success('Task created!')
    form.value.task_name = ''
    tasksListRef.value?.reload()
  } catch (error) {
    toast.error(error.message)
  }
}
</script>

<template>
  <Dashboard>
    <div class="flex flex-col items-center min-h-screen p-10">

      <div class="mb-8 w-full max-w-md">
        <label class="block mb-2 font-semibold text-gray-700">Select Project:</label>
        <select
            v-model="selectedProjectId"
            class="w-full p-2 border rounded-lg shadow-sm border-amber-50"
        >
          <option value="" disabled>Choose a project</option>
          <option class="rounded-lg" v-for="proj in projects" :key="proj.id" :value="proj.id">
            {{ proj.name }}
          </option>
        </select>
        <span v-if="errors.project" class="text-red-500 text-xs">{{ errors.project }}</span>
      </div>

      <div v-if="selectedProjectId" class="flex flex-row items-start gap-10 w-full">

        <div class="flex-1">
          <TasksList ref="tasksListRef" :projectId="selectedProjectId" />
        </div>

        <div class="bg-white w-80 rounded-lg p-6 shadow shrink-0">
          <h1 class="text-center text-xl font-semibold text-gray-800 mb-4">Create Task</h1>
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
            <div>
              <input
                  v-model="form.task_name"
                  type="text"
                  placeholder="New Task Name"
                  :class="errors.task_name ? 'border-red-500' : 'border-gray-300'"
                  class="border p-2 rounded w-full"
              />
              <span v-if="errors.task_name" class="text-red-500 text-xs">{{ errors.task_name }}</span>
            </div>
            <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded cursor-pointer transition"
            >
              Add Task
            </button>
          </form>
        </div>

      </div>

      <div v-else class="text-gray-400 italic mt-10">
        Select a project to view and manage tasks
      </div>

    </div>
  </Dashboard>
</template>