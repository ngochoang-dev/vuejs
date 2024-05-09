import { handleApiError } from '@/utils'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  const todoLoading = ref(false)
  const todo = ref({
    data: [] as any[],
    count: 0
  })

  const handleGetTodo = async (page = 1) => {
    todoLoading.value = true
    try {
      const res = await axios.get(`/todo?page=${page}`)
      todo.value = res.data
      todoLoading.value = false
    } catch (error) {
      todoLoading.value = false
      return handleApiError(error)
    }
  }

  const handleCreateTodo = async (
    data: { title: string; content: string; deadline: string | null },
    callback: () => void
  ) => {
    todoLoading.value = true
    try {
      const res = await axios.post(`/todo`, data)
      callback()
      todoLoading.value = false
    } catch (error) {
      todoLoading.value = false
      return handleApiError(error)
    }
  }

  const handleDeleteTodo = async (id: string, callback: () => void) => {
    todoLoading.value = true
    try {
      const res = await axios.delete(`/todo/${id}`)
      callback()
      todoLoading.value = false
    } catch (error) {
      todoLoading.value = false
      return handleApiError(error)
    }
  }

  return {
    todoLoading,
    todo,
    handleGetTodo,
    handleCreateTodo,
    handleDeleteTodo
  }
})
