<script setup>
import { ref } from 'vue'
import CandidatesList from '@/components/CandidatesList.vue'
import Form from '@/components/Form.vue'

const handleLogout = () => {
  localStorage.removeItem('token')
  window.location.reload()
}
</script>

<template>
  <div class="flex min-h-screen">
    <div class="w-48 bg-gray-800 text-white flex flex-col p-4 gap-2">
      <RouterLink class="hover:bg-gray-700 p-2 rounded text-left bg-blue-600" to="/users"
      >Users</RouterLink
      >
      <RouterLink class="hover:bg-gray-700 p-2 rounded text-left bg-blue-600" to="/projects"
      >Projects</RouterLink
      >
      <RouterLink class="hover:bg-gray-700 p-2 rounded text-left bg-blue-600" to="/tasks"
      >Tasks</RouterLink
      >
      <RouterLink class="hover:bg-gray-700 p-2 rounded text-left bg-blue-600" to="/timelog"
      >Time Log</RouterLink
      >
    </div>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
