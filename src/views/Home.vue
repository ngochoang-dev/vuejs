<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import { watchEffect, watch, ref } from 'vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const todoStore = useTodoStore()

const messageError = ref<undefined | string>('')
const dialog = ref(false)
const isFormValid = ref(false)
const page = ref(Number(route.query?.page) || 1)

const getInitTodo = () => ({
  title: '',
  content: '',
  deadline: null
})
const todo = ref(getInitTodo())

const todoRules = [
  (val: string) => {
    if (val) return true
    return 'Please enter'
  }
]

const dateRules = [
  (val: any) => {
    if (new Date(val) instanceof Date) return true
    return 'Please enter date'
  }
]

const handleLogout = () => {
  authStore.logout()
  router.push('/signin')
}

const handleSubmit = () => {
  if (isFormValid.value) {
    todoStore.handleCreateTodo(todo.value, () => {
      dialog.value = false
      todo.value = getInitTodo()
      handleGetTodo(page.value)
    })
  }
}

const handleGetTodo = async (page: number) => {
  messageError.value = await todoStore.handleGetTodo(page)
}

const handleOpenEditTodo = (item: any) => {
  dialog.value = true
  todo.value.title = item.title
  todo.value.content = item.content
  todo.value.deadline = item.deadline
}

watch(page, (newPage) => {
  router.push({
    path: route.fullPath,
    query: {
      page: newPage.toString()
    }
  })
})

watchEffect(() => handleGetTodo(page.value))
</script>

<template>
  <v-container>
    <v-btn icon="mdi-logout" size="small" @click="handleLogout"></v-btn>
    <div class="text-center pa-4">
      <v-dialog v-model="dialog" max-width="400" persistent>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn icon="mdi-plus" size="small" color="success" v-bind="activatorProps"></v-btn>
        </template>

        <v-card>
          {{ messageError }}
          <v-form v-model="isFormValid" @submit.prevent="handleSubmit">
            <v-card-text>
              <v-text-field
                v-model="todo.title"
                :rules="todoRules"
                label="Title*"
                required
              ></v-text-field>

              <v-text-field
                v-model="todo.content"
                :rules="todoRules"
                label="Content*"
                required
              ></v-text-field>

              <v-date-input
                v-model="todo.deadline"
                label="Deadline*"
                max-width="368"
                prepend-icon=""
                :rules="[...todoRules, ...dateRules]"
                required
              ></v-date-input>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text="Close"
                variant="plain"
                @click="(dialog = false), (todo = getInitTodo())"
              ></v-btn>
              <v-btn
                type="submit"
                color="primary"
                text="Create"
                variant="tonal"
                :loading="todoStore.todoLoading"
              ></v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </div>
    <v-alert v-if="!todoStore.todo.data.length && !todoStore.todoLoading" text="No data"></v-alert>
    <template v-for="item in todoStore.todo.data">
      <v-row align="center">
        <v-list-item lines="two" :subtitle="item.content" :title="item.title" rounded></v-list-item>
        <v-btn
          icon="mdi-delete"
          size="small"
          @click="todoStore.handleDeleteTodo(item._id, () => handleGetTodo(page))"
        ></v-btn>
        <v-btn
          icon="mdi-square-edit-outline"
          size="small"
          @click="() => handleOpenEditTodo(item)"
        ></v-btn>
      </v-row>
    </template>
    <v-pagination
      v-if="todoStore.todo.data.length && !todoStore.todoLoading"
      v-model="page"
      :length="3"
    ></v-pagination>
  </v-container>
</template>
