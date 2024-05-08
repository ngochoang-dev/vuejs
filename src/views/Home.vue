<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import { watchEffect } from 'vue'

const router = useRouter()

const authStore = useAuthStore()
const todoStore = useTodoStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/signin')
}

watchEffect(() => {
  todoStore.handleGetTodo(1)
})
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col class="mb-12" cols="12" md="6">
        <v-skeleton-loader :loading="todoStore.todoLoading" type="list-item-two-line">
          <v-list-item lines="two" subtitle="Subtitle" title="Title" rounded></v-list-item>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>
