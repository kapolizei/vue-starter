<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import Dashboard from '@/components/Dashboard.vue'
const toast = useToast()
const token = localStorage.getItem('token')
const errors = ref({})
const stage = ref(1)
const error = ref('')
const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  country: '',
  birth: '',
  position: '',
  linkedin: '',

  education_level: '',
  experience: null,
  skills: [],
  prev_employer: '',
  cur_job_tittle: '',
  notice_period: '',
  salary: null,
  avail_for_interview: '',
  prefer_location: '',
  cover_letter: '',
  application_source: '',

  resume: null,
})

const skillsMap = {
  'Software Engineer': [
    'JavaScript',
    'Python',
    'SQL',
    'Java',
    'C#',
    'React',
    'Node.js',
    'AWS',
    'Docker',
    'Kubernetes',
  ],
  'Data Analyst': ['SQL', 'Python', 'R', 'Excel', 'Tableau', 'PowerBI', 'SAS', 'MATLAB'],
  'Project Manager': ['Agile', 'Scrum', 'Project Planning', 'Risk Management', 'Budgeting'],
  'QA Engineer': ['Test Automation', 'Selenium', 'JIRA', 'TestRail', 'Performance Testing'],
  'UX Designer': ['Sketch', 'Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing'],
}

const availableSkills = computed(() => skillsMap[form.value.position] || [])

const handleFile = (e) => {
  form.value.resume = e.target.files[0]
}

const stage1Complete = computed(
    () =>
        form.value.first_name &&
        form.value.last_name &&
        form.value.email &&
        form.value.phone &&
        form.value.birth &&
        form.value.position &&
        form.value.resume,
)

const goToStage2 = () => {
  if (!validateStage1()) return
  if (stage1Complete.value) stage.value = 2
}

const validateStage1 = () => {
  errors.value = {}
  if (!form.value.first_name && form.value.first_name.length < 2)
    errors.value.first_name = 'Field is required, please enter first name.'
  if (!form.value.last_name && form.value.last_name.length < 2)
    errors.value.last_name = 'Field is required, please enter last name.'
  if (!form.value.email) errors.value.email = 'Required'
  if (!form.value.phone && form.value.phone.length < 6)
    errors.value.phone = 'Enter valid phone number.'
  if (!form.value.birth) errors.value.birth = 'Required'
  if (!form.value.position) errors.value.position = 'Required'
  if (!form.value.resume) errors.value.resume = 'Required'

  return Object.keys(errors.value).length === 0
}

const validateStage2 = () => {
  if (!form.value.education_level) errors.value.education_level = 'Required'
  if (!form.value.application_source) errors.value.application_source = 'Required'

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateStage1()) return
  if (!validateStage2()) return

  const formData = new FormData()
  if (form.value.resume) {
    formData.append('resume', form.value.resume)
  }
  formData.append('first_name', form.value.first_name)
  formData.append('last_name', form.value.last_name)
  formData.append('email', form.value.email)
  formData.append('phone', form.value.phone)
  formData.append('street', form.value.street)
  formData.append('city', form.value.city)
  formData.append('country', form.value.country)
  formData.append('birth', form.value.birth)
  formData.append('position', form.value.position)
  formData.append('linkedin', form.value.linkedin)

  formData.append('education_level', form.value.education_level)
  if (form.value.experience) formData.append('experience', form.value.experience)
  formData.append('skills', form.value.skills)
  formData.append('prev_employer', form.value.prev_employer)
  formData.append('cur_job_tittle', form.value.cur_job_tittle)
  formData.append('notice_period', form.value.notice_period)
  if (form.value.salary) formData.append('salary', form.value.salary)
  formData.append('avail_for_interview', form.value.avail_for_interview)
  formData.append('prefer_location', form.value.prefer_location)
  formData.append('cover_letter', form.value.cover_letter)
  formData.append('application_source', form.value.application_source)

  console.log('Form data: ', formData)

  try {
    const res = await fetch('http://localhost:3000/api/candidate', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: formData,
    })
    const data = await res.json()
    if (res.status === 409 || res.status === 404) {
      toast.error(data.error)
    } else {
      toast.success('Application submitted!')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  } catch (error) {
    console.log(error)
  }
}

const emit = defineEmits(['dirty'])
watch(form, () => emit('dirty'), { deep: true })
</script>

<template>
  <Dashboard>
    <div class="flex items-center justify-center min-h-screen">
      <div class="bg-white w-2xl rounded-lg p-6 shadow">
        <h1 class="text-center text-xl font-semibold text-gray-800 mb-4">Create Candidate Form</h1>

        <div class="flex gap-2 mb-6">
          <button
              :class="stage === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'"
              class="px-4 py-2 rounded-full text-sm font-medium transition"
          >
            Stage 1
          </button>
          <button
              @click="stage = 2"
              :disabled="!stage1Complete"
              :class="[
              stage === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500',
              !stage1Complete ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
            ]"
              class="px-4 py-2 rounded-full text-sm font-medium transition"
          >
            Stage 2
          </button>
        </div>

        <!-- Stage 1 -->
        <form v-if="stage === 1" @submit.prevent="goToStage2" class="flex flex-col gap-4">
          <input
              v-model="form.first_name"
              type="text"
              placeholder="First Name"
              :class="errors.first_name ? 'border-red-500' : 'border-gray-300'"
              class="border p-2 rounded"
          />
          <span v-if="errors.first_name" class="text-red-500 text-xs">{{ errors.first_name }}</span>

          <input
              v-model="form.last_name"
              type="text"
              placeholder="Last Name"
              :class="errors.last_name ? 'border-red-500' : 'border-gray-300'"
              class="border p-2 rounded"
          />
          <span v-if="errors.first_name" class="text-red-500 text-xs">{{ errors.last_name }}</span>

          <input
              :class="errors.email ? 'border-red-500' : 'border-gray-300'"
              v-model="form.email"
              type="email"
              placeholder="Email"
              class="border p-2 rounded"
          />

          <input
              :class="errors.phone ? 'border-red-500' : 'border-gray-300'"
              v-model="form.phone"
              type="tel"
              placeholder="Phone"
              class="border p-2 rounded"
          />
          <span v-if="errors.phone" class="text-red-500 text-xs">{{ errors.phone }}</span>
          <div>
            <h1>Address information</h1>
            <input
                v-model="form.street"
                type="tel"
                placeholder="Street"
                class="border p-2 rounded w-56 border-gray-300"
            />

            <input
                v-model="form.city"
                type="tel"
                placeholder="City"
                class="border p-2 rounded w-24 border-gray-300"
            />
            <input
                v-model="form.country"
                type="tel"
                placeholder="Country"
                class="border p-2 rounded w-24 border-gray-300"
            />
          </div>

          <br />

          <input
              :class="errors.birth ? 'border-red-500' : 'border-gray-300'"
              v-model="form.birth"
              type="date"
              placeholder="date"
              class="border p-2 rounded"
          />

          <select
              :class="errors.position ? 'border-red-500' : 'border-gray-300'"
              v-model="form.position"
              type="select"
              class="border p-2 rounded"
          >
            <option value="" disabled>Select position</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Project Manager">Project Manager</option>
            <option value="QA Engineer">QA Engineer</option>
            <option value="UX Designer">UX Designer</option>
          </select>
          <label class="text-sm text-gray-600">Resume/CV</label>
          <input
              :class="errors.resume ? 'border-red-500' : 'border-gray-300'"
              type="file"
              accept=".pdf,.doc,.docx"
              @change="handleFile"
              class="border p-2 rounded text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
          />
          <input
              v-model="form.linkedin"
              type="url"
              placeholder="LinkedIn"
              class="border p-2 rounded border-gray-300"
          />

          <button type="submit" class="bg-blue-600 text-white p-2 rounded cursor-pointer">
            Next →
          </button>
        </form>

        <!-- Stage 2 -->
        <form v-if="stage === 2" @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <select
              :class="errors.education_level ? 'border-red-500' : 'border-gray-300'"
              v-model="form.education_level"
              type="select"
              class="border p-2 rounded"
          >
            <option value="" disabled>Education Level</option>
            <option value="High School">High School</option>
            <option value="Associate's Degree">Associate's Degree</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="Doctorate">Doctorate</option>
          </select>

          <input
              v-model="form.experience"
              type="number"
              placeholder="Years of experience"
              class="border p-2 rounded border-gray-300"
          />

          <div class="flex flex-wrap gap-2">
            <h1>Skills</h1>
            <label
                v-for="skill in availableSkills"
                :key="skill"
                class="flex items-center gap-1 border px-3 py-1 rounded-full cursor-pointer"
                :class="
                form.skills.includes(skill)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300'
              "
            >
              <input type="checkbox" :value="skill" v-model="form.skills" class="hidden" />
              {{ skill }}
            </label>
          </div>

          <input
              v-model="form.prev_employer"
              type="text"
              placeholder="Previous Employer"
              class="border p-2 rounded border-gray-300"
          />

          <input
              v-model="form.cur_job_tittle"
              type="text"
              placeholder="Current Job Title"
              class="border p-2 rounded border-gray-300"
          />

          <select
              v-model="form.notice_period"
              type="select"
              class="border p-2 rounded border-gray-300"
          >
            <option value="" disabled>Notice Period</option>
            <option value="Immediate">Immediate</option>
            <option value="1 Week">1 Week</option>
            <option value="2 Weeks">2 Weeks</option>
            <option value="1 Month">1 Month</option>
            <option value="More than 1 Month">More than 1 Month</option>
          </select>

          <input
              v-model="form.salary"
              type="number"
              placeholder="Expected Salary"
              class="border p-2 rounded border-gray-300"
          />

          <p>Availability for Interview</p>
          <input
              v-model="form.avail_for_interview"
              type="date"
              placeholder="Availability for Interview"
              class="border p-2 rounded border-gray-300"
          />

          <select
              v-model="form.prefer_location"
              type="select"
              class="border p-2 rounded border-gray-300"
          >
            <option value="" disabled>Preferred Location</option>
            <option value="New York">New York</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Chicago">Chicago</option>
            <option value="Austin">Austin</option>
            <option value="Remote">Remote</option>
          </select>

          <textarea
              v-model="form.cover_letter"
              placeholder="Cover Letter"
              rows="2"
              class="border p-2 rounded resize-none border-gray-300"
          />

          <select
              :class="errors.application_source ? 'border-red-500' : 'border-gray-300'"
              v-model="form.application_source"
              type="select"
              class="border p-2 rounded"
          >
            <option value="" disabled>Source of Application</option>
            <option value="Company Website">Company Website</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Job Board">Job Board</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>

          <div class="flex gap-2">
            <button
                type="button"
                @click="stage = 1"
                class="bg-gray-200 text-gray-700 p-2 rounded w-full"
            >
              ← Back
            </button>
            <button type="submit" class="bg-green-600 text-white p-2 rounded w-full">Submit</button>
          </div>
          <span class="text-center" v-if="error">{{ error }}</span>
        </form>
      </div>
    </div>
  </Dashboard>
</template>
