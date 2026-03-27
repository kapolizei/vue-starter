import { createRouter, createWebHistory } from 'vue-router'
import AuthForm from '../components/AuthForm.vue'
import Dashboard from '../components/Dashboard.vue'
import Users from '@/components/Users.vue'
import Form from '@/components/Form.vue'
import CandidatesList from '@/components/CandidatesList.vue'
import Projects from '@/components/Projects.vue'
import Timelog from '@/components/Timelog.vue'
import Tasks from "@/components/Tasks.vue";

const routes = [
  {
    path: '/',
    component: Users,
  },
  {
    path: '/projects',
    component: Projects,
  },
  {
    path: '/users',
    component: Users,
  },
  {
    path: '/tasks',
    component: Tasks,
  },
  {
    path: '/timelog',
    component: Timelog,
  },
]

export default createRouter({
  history: createWebHistory(),
  routes
})