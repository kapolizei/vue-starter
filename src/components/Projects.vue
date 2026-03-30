<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import Dashboard from '@/components/Dashboard.vue'
import ProjectsList from '@/components/ProjectsList.vue'
const toast = useToast()
const projectsRef = ref(null)
const errors = ref('')
const form = ref({
  project_title: '',
})

const validate = () => {
  errors.value = {}
  if (!form.value.project_title || form.value.project_title.length < 2)
    errors.value.project_title = 'Field is required, please enter first name.'
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return
  try {
    const res = await fetch('https://project-rainfall-20113304171.development.catalystserverless.eu/server/project_rainfall_function/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: form.value.project_title}),
    })
    const data = await res.json()
    if (res.status === 409 || res.status === 404) {
      toast.error(data.error)
    } else {
      toast.success('Project created!')
      projectsRef.value?.reload()
    }
  } catch (error) {
    console.log(error)
  }
}

</script>
<template>
  <Dashboard>
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex items-center justify-center mr-36">
        <ProjectsList ref="projectsRef" />
      </div>

      <div class="bg-white w-2xl rounded-lg p-6 shadow">
        <h1 class="text-center text-xl font-semibold text-gray-800 mb-4">Create Project Form</h1>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <input
              v-model="form.project_title"
              type="text"
              placeholder="Project Title"
              :class="errors.project_title ? 'border-red-500' : 'border-gray-300'"
              class="border p-2 rounded"
          />
          <span v-if="errors.project_title" class="text-red-500 text-xs">{{ errors.project_title }}</span>

          <button type="submit" class="bg-blue-600 text-white p-2 rounded cursor-pointer">
            Submit
          </button>
        </form>
      </div>
    </div>
  </Dashboard>
</template>
