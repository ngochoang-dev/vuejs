<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import type { Ref } from 'vue'
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter, useRoute } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const store = useAuthStore()

const data = reactive({
  username: '',
  password: ''
})
const messageError: Ref<undefined | string> = ref(undefined)
const isFormValid = ref(false)

const usernameRules = [
  (val: string) => {
    if (val) return true
    return t('auth.form.username.required')
  }
]

const passwordRules = [
  (val: string) => {
    if (val) return true
    return t('auth.form.password.required')
  }
]

async function handleSubmit() {
  messageError.value = ''
  if (isFormValid.value) {
    messageError.value = await store.handleSignIn(data, () => {
      router.replace('/')
    })
  }
}
</script>

<template>
  <v-container class="container">
    <v-sheet class="mx-auto signin-view" width="300">
      <p style="height: 20px">{{ messageError }}</p>
      <v-form v-model="isFormValid" @submit.prevent="handleSubmit" validate-on="input">
        <v-text-field
          v-model="data.username"
          :rules="usernameRules"
          label="Username:"
        ></v-text-field>
        <v-text-field
          v-model="data.password"
          :rules="passwordRules"
          label="Password:"
        ></v-text-field>
        <v-btn
          rounded="xs"
          variant="outlined"
          type="submit"
          block
          class="btn-submit"
          :loading="store.authLoading"
          >{{ t('auth.signin.buttonSignIn') }}</v-btn
        >
        <div class="to-other-sign">
          <p>{{ t('auth.signin.questionAccount') }}</p>
          <RouterLink to="/signup">{{ t('auth.signup.buttonSignUp') }}</RouterLink>
        </div>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<style scoped>
.container {
  height: 100vh;
}

.signin-view {
  margin-top: 100px;
}

.to-other-sign {
  margin-top: 20px;
}

.btn-submit {
  margin-top: 10px;
}
</style>
