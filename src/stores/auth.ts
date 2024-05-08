import { handleApiError } from '@/utils'
import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const authenticated = ref(false)
    const authLoading = ref(false)
    const messageError = ref('')
    const accessToken = ref('')
    const refreshToken = ref('')

    async function handleSignIn(data: { username: string; password: string }) {
      authLoading.value = true

      try {
        const res = await axios.post('/user/sign-in', data)

        accessToken.value = res.data.accessToken
        refreshToken.value = res.data.refreshToken

        authenticated.value = true
        authLoading.value = false
      } catch (error) {
        messageError.value = handleApiError(error)
        authLoading.value = false
      }
    }

    function handleSignUp(data: { username: string; password: string }) {
      authenticated.value = true
    }

    return { authenticated, authLoading, messageError, handleSignIn, handleSignUp }
  },
  {
    persist: true
  }
)
