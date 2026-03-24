<script>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  setup() {
    const form = ref({
      account_name: '',
      amount: '',
      account_phone: '',
      deal_name: '',
      deal_stage: '',
      resume: null,
    })

    const handleFile = (e) => {
      form.value.resume = e.target.files[0]
    }

    const errors = ref({})
    const loading = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')
    const authorized = ref(false)

    const inputClass = (hasError) => [
      'w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 placeholder-slate-400',
      'focus:outline-none focus:ring-2 transition-all duration-150 bg-white',
      hasError
          ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
    ]

    const selectClass = (hasError) => [
      'w-full px-4 py-2.5 rounded-lg border text-sm appearance-none',
      'focus:outline-none focus:ring-2 transition-all duration-150 bg-white pr-9',
      hasError
          ? 'border-red-400 focus:border-red-500 focus:ring-red-100 text-slate-800'
          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 text-slate-800'
    ]

    const validate = () => {
      const e = {}
      if (!form.value.account_name.trim()) e.account_name = 'Account name is required'
      if (!form.value.amount.trim()) e.amount = 'Website is required'
      if (!form.value.account_phone.trim()) e.account_phone = 'Phone is required'
      if (!form.value.deal_name.trim()) e.deal_name = 'Deal name is required'
      if (!form.value.deal_stage) e.deal_stage = 'Deal stage is required'
      return e
    }

    const handleSubmit = async () => {
      successMessage.value = ''
      errorMessage.value = ''
      errors.value = validate()

      if (Object.keys(errors.value).length > 0) return
      loading.value = true

      const formData = new FormData()
      if(form.value.resume) formData.append('resume', form.value.resume)
      formData.append('account_name', form.value.account_name)
      formData.append('amount', form.value.amount)
      formData.append('account_phone', form.value.account_phone)
      formData.append('deal_name', form.value.deal_name)
      formData.append('deal_stage', form.value.deal_stage)

      console.log("Form Data: ", formData)


      try {
        const response = await fetch('https://project-rainfall-20113304171.development.catalystserverless.eu/server/test2/datastore', {
          method: 'POST',
          body: formData
        })

        const responseText = await response
        try {
          console.log(responseText)
        } catch {
          throw new Error(
              `Server returned invalid response. Make sure backend is running on port 8000.`
          )
        }

        if (!response.status === 200) {
          toast.error(data.errors);
          } else {
          toast.success('Создано!', {
            autoClose: 3000,
            position: toast.POSITION.TOP_RIGHT,
          });
          form.value = {
            account_name: '',
            account_website: '',
            account_phone: '',
            deal_name: '',
            deal_stage: '',
            resume: null,
          }

          }
        } catch (error) {
        errorMessage.value = error.message
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      loading,
      successMessage,
      errorMessage,
      handleSubmit,
      inputClass,
      selectClass,
      authorized,
      handleFile
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form @submit.prevent="handleSubmit">
          <div class="px-6 pt-6 pb-4">
            <div class="flex items-center gap-3 mb-5">
              <span
                  class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0"
              >1</span
              >
              <h2 class="text-base font-semibold text-slate-700">Account Details</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Account Name <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.account_name"
                    type="text"
                    placeholder="e.g. Acme Corp"
                    :class="inputClass(errors.account_name)"
                />
                <p v-if="errors.account_name" class="text-xs text-red-600 flex items-center gap-1">
                  <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                  </svg>
                  {{ errors.account_name }}
                </p>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Amount <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.amount"
                    type="text"
                    placeholder="500"
                    :class="inputClass(errors.account_website)"
                />
                <p
                    v-if="errors.account_website"
                    class="text-xs text-red-600 flex items-center gap-1"
                >
                  <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                  </svg>
                  {{ errors.account_website }}
                </p>
              </div>

              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Phone <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.account_phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    :class="inputClass(errors.account_phone)"
                />
                <p v-if="errors.account_phone" class="text-xs text-red-600 flex items-center gap-1">
                  <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                  </svg>
                  {{ errors.account_phone }}
                </p>
              </div>
            </div>
          </div>

          <div class="mx-6 border-t border-slate-100"></div>

          <div class="px-6 pt-5 pb-6">
            <div class="flex items-center gap-3 mb-5">
              <span
                  class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0"
              >2</span
              >
              <h2 class="text-base font-semibold text-slate-700">Deal Details</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Deal Name <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.deal_name"
                    type="text"
                    placeholder="e.g. Annual Subscription"
                    :class="inputClass(errors.deal_name)"
                />
                <p v-if="errors.deal_name" class="text-xs text-red-600 flex items-center gap-1">
                  <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                  </svg>
                  {{ errors.deal_name }}
                </p>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Deal Stage <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select v-model="form.deal_stage" :class="selectClass(errors.deal_stage)">
                    <option value="" disabled>Select stage...</option>
                    <option value="Qualification">Qualification</option>
                    <option value="Needs Analysis">Needs Analysis</option>
                    <option value="Value Proposition">Value Proposition</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                        class="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p v-if="errors.deal_stage" class="text-xs text-red-600 flex items-center gap-1">
                  <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                  </svg>
                  {{ errors.deal_stage }}
                </p>
              </div>
            </div>
          </div>

          <div class="px-6 pb-2">
            <label class="text-sm text-gray-600">Resume/CV</label>
            <input
                :class="errors.resume ? 'border-red-500' : 'border-gray-300'"
                type="file"
                accept=".pdf,.doc,.docx"
                @change="handleFile"
                class="border p-2 rounded text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
            />

          </div>

          <div class="px-6 pb-6">
            <button
                type="submit"
                :disabled="loading"
                class="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors duration-200 shadow-sm"
            >
              <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                />
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <svg
                  v-else
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {{ loading ? 'Creating record...' : 'Create Record in Zoho CRM' }}
            </button>

            <p class="text-center text-xs text-slate-400 mt-3">
              Account and Deal will be linked automatically
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
