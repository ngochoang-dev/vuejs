import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import i18n from './locales'
import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from './stores/auth'

axios.defaults.baseURL = 'http://localhost:5000'

const vuetify = createVuetify({
  components,
  directives
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(i18n)

axios.interceptors.request.use(
  function (config) {
    const authStore = useAuthStore()

    config.headers.Authorization = 'Bearer ' + authStore.token.accessToken
    console.log('x', authStore.token.accessToken)

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (config) {
    return config
  },
  async function (error) {
    console.log(error)
    const authStore = useAuthStore()

    const { config, response } = error

    if (response.status && response.status === 401) {
      console.log('resfresh')
      try {
        const res: AxiosResponse<string, string> = await axios.post('/user/reissue', {
          refreshToken: authStore.token.refreshToken
        })
        authStore.setToken({ accessToken: res.data })
        return axios(config)
      } catch (error) {
        authStore.logout()
        router.push('/signin')
      }
    }

    return Promise.reject(error)
  }
)

app.mount('#app')
