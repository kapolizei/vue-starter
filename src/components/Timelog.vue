<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import Dashboard from '@/components/Dashboard.vue'

const toast = useToast()
const projects = ref([])
const selectedProjectId = ref('')
const selectedTask = ref(null) // ← выбранная таска кликом
const errors = ref({})
const tasks = ref([])
const loading = ref(false)

const form = ref({
  log_name: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  hours: '',
  bill_status: 'Billable',
  module: {
    id: '',
    type: 'task'
  },
  owner_zpuid: '329538000000070003'

})

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/projects')
    const data = await res.json()
    projects.value = data.projects || []
  } catch {
    toast.error('Failed to load projects')
  }
})

watch(selectedProjectId, async (id) => {
  if (!id) return
  selectedTask.value = null
  loading.value = true
  try {
    const res = await fetch(`http://localhost:3000/api/tasks/${id}`)
    const data = await res.json()
    tasks.value = data.tasks.tasks || []
    console.log(tasks.value)
  } catch {
    toast.error('Failed to load tasks')
  } finally {
    loading.value = false
  }
})

const validate = () => {
  errors.value = {}
  if (!selectedTask.value) errors.value.task = 'Please select a task'
  if (!form.value.log_name || form.value.log_name.length < 2)
    errors.value.log_name = 'Log Name is required'
  if (!form.value.hours && !form.value.minutes)
    errors.value.duration = 'Enter hours or minutes'
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return
  try {
    const res = await fetch(
        `http://localhost:3000/api/time/${selectedProjectId.value}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: form.value.description,
            date: form.value.date,
            hours: Number(form.value.hours) || 0,
            minutes: Number(form.value.minutes) || 0,
            bill_status: form.value.bill_status,
            module: form.value.module,
            owner_zpuid: form.value.owner_zpuid,
          }),
        }
    )
    if (!res.ok) throw new Error('Failed to create timelog')
    toast.success('Time logged!')
    form.value.description = ''
    form.value.hours = ''
    form.value.minutes = ''
  } catch (err) {
    toast.error(err.message)
  }
}

const selectTask = () => {

}
</script>

<template>
  <Dashboard>
    <div class="flex flex-col items-center min-h-screen p-10">

      <div class="mb-8 w-full max-w-md">
        <label class="block mb-2 font-semibold text-gray-700">Select Project:</label>
        <select v-model="selectedProjectId" class="w-full p-2 border rounded-lg shadow-sm">
          <option value="" disabled>Choose a project</option>
          <option v-for="proj in projects" :key="proj.id" :value="proj.id">
            {{ proj.name }}
          </option>
        </select>
        <span v-if="errors.project" class="text-red-500 text-xs">{{ errors.project }}</span>
      </div>

      <div v-if="selectedProjectId" class="flex flex-row items-start gap-10 w-full">

        <div class="flex-1">
          <div v-if="loading" class="text-gray-400 text-center py-10">Loading...</div>
          <div v-else-if="tasks.length === 0" class="text-center text-gray-400 py-10">No tasks yet.</div>
          <div v-else class="overflow-x-auto">
            <p class="text-xs text-gray-400 mb-2 italic">Click a row to select task for logging</p>
            <table class="text-sm text-left w-full rounded-2xl overflow-hidden">
              <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th class="px-4 py-3">Task Name</th>
                <th class="px-4 py-3">Complete %</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">ID</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="task in tasks"
                  :key="task.id"
                  @click="() => {selectedTask = task; form.module.id = task.id}"
                  :class="selectedTask?.id === task.id
                    ? 'bg-blue-50 border-l-2 border-blue-500'
                    : 'hover:bg-gray-50'"
                  class="border-t border-gray-200 transition cursor-pointer"
              >
                <td class="px-4 py-3 font-medium text-gray-800">{{ task.name }}</td>
                <td class="px-4 py-3 text-gray-600">{{ task.completion_percentage }}</td>
                <td class="px-4 py-3">
                    <span
                        :class="task.status?.name === 'Open' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                        class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ task.status?.name || '—' }}
                    </span>
                </td>
                <td class="px-4 py-3 text-gray-500">{{ task.id }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Форма тайм-лога -->
        <div class="bg-white w-80 rounded-xl p-6 shadow-md border border-gray-100 shrink-0 self-start sticky top-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-1">Log Time</h2>
          <p v-if="selectedTask" class="text-xs text-blue-600 mb-4 truncate">
            Task: {{ selectedTask.name }}
          </p>
          <p v-else class="text-xs text-gray-400 mb-4 italic">No task selected</p>
          <span v-if="errors.task" class="text-red-500 text-xs block mb-2">{{ errors.task }}</span>

          <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
            <div>

              <input
                  v-model="form.log_name"
                  type="text"
                  placeholder="Log Name"
                  :class="errors.log_name ? 'border-red-400' : 'border-gray-200'"
                  class="border p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
              <span v-if="errors.log_name" class="text-red-500 text-xs mt-1 block">{{ errors.log_name }}</span>
            </div>

            <input
                v-model="form.date"
                type="date"
                class="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <input
                disabled
                v-model="form.module.id"
                type="text"
                placeholder="Module id"
                class="border border-gray-200 p-2.5 pb-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />

            <div class="flex gap-2">
              <div class="flex-1">
                <input
                    v-model="form.hours"
                    type="number"
                    min="0"
                    placeholder="Hours"
                    class="border border-gray-200 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div class="flex-1">
                <input
                    v-model="form.minutes"
                    type="number"
                    min="0"
                    max="59"
                    placeholder="Minutes"
                    class="border border-gray-200 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
            <span v-if="errors.duration" class="text-red-500 text-xs">{{ errors.duration }}</span>

            <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2 rounded-lg text-sm font-medium transition-all"
            >
              Log Time
            </button>
          </form>
        </div>

      </div>

      <div v-else class="text-gray-400 italic mt-10">
        Select a project to view tasks
      </div>

    </div>
  </Dashboard>
</template>