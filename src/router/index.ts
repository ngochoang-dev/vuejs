import { createRouter, createWebHistory } from 'vue-router'

import SignIn from '@/views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'
import Home from '@/views/Home.vue'

import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'signin',
      path: '/signin',
      component: SignIn
    },
    {
      name: 'signup',
      path: '/signup',
      component: SignUp
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useAuthStore()

  if (to.meta.requiresAuth && !store.authenticated) {
    return next({
      path: '/signin',
      query: { redirect: to.fullPath }
    })
  }

  if (store.authenticated && (to.path === '/signin' || to.path === '/signup')) {
    next('/')
  } else {
    next()
  }
})

export default router
