<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const store = useAuthStore()

const username = ref('')
const password = ref('')
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

function handleSubmit() {
  if (isFormValid.value) {
    store.handleSignIn({
      username: username.value,
      password: password.value
    })
  }
}
</script>

<template>
  <v-container class="container">
    <v-sheet class="mx-auto signin-view" width="300">
      {{ store.messageError }}
      <v-form v-model="isFormValid" @submit.prevent="handleSubmit" validate-on="input">
        <v-text-field v-model="username" :rules="usernameRules" label="Username:"></v-text-field>
        <v-text-field v-model="password" :rules="passwordRules" label="Password:"></v-text-field>
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
