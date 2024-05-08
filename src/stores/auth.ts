import { handleApiError } from '@/utils'
import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const authenticated = ref(false)
    const authLoading = ref(false)

    const token = reactive({
      accessToken: '',
      refreshToken: ''
    })

    function logout() {
      authenticated.value = false
      token.accessToken = ''
      token.refreshToken = ''
    }

    async function handleSignIn(
      data: { username: string; password: string },
      callback: () => void
    ) {
      authLoading.value = true

      try {
        const res = await axios.post('/user/sign-in', data)

        token.accessToken = res.data.accessToken
        token.refreshToken = res.data.refreshToken

        authenticated.value = true
        authLoading.value = false
        callback()
      } catch (error) {
        authLoading.value = false
        return handleApiError(error)
      }
    }

    async function handleSignUp(
      data: { username: string; password: string },
      callback: () => void
    ) {
      authLoading.value = true

      try {
        await axios.post('/user', data)
        authLoading.value = false
        callback()
      } catch (error) {
        authLoading.value = false
        return handleApiError(error)
      }
    }

    function setToken({
      accessToken = '',
      refreshToken = ''
    }: {
      accessToken?: string
      refreshToken?: string
    }) {
      console.log('accessToken', accessToken)
      console.log('refreshToken', refreshToken)
      accessToken && (token.accessToken = accessToken)
      refreshToken && (token.refreshToken = refreshToken)
    }

    return {
      authenticated,
      authLoading,
      token,
      handleSignIn,
      handleSignUp,
      logout,
      setToken
    }
  },
  {
    persist: {
      paths: ['authenticated', 'token']
    }
  }
)
