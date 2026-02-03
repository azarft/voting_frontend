import { createRouter, createWebHistory } from 'vue-router'
import type { Pinia } from 'pinia'
import LoginView from '../views/LoginView.vue'
import VotingView from '../views/VotingView.vue'
import ResultsView from '../views/ResultsView.vue'
import AdminView from '../views/AdminView.vue'
import { useAuthStore } from '../stores/auth'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/vote',
      name: 'vote',
      component: VotingView,
      meta: { requiresAuth: true }
    },
    {
      path: '/results',
      name: 'results',
      component: ResultsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

export const setupRouterGuards = (pinia: Pinia) => {
  router.beforeEach((to) => {
    const authStore = useAuthStore(pinia)
    const isAdminEmail = authStore.email === 'argen.azanov@alatoo.edu.kg'

    if (to.name === 'login' && authStore.isAuthenticated) {
      return { path: '/vote' }
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { path: '/login' }
    }

    if (to.meta.requiresAdmin && !isAdminEmail) {
      return { path: '/vote' }
    }

    return true
  })
}
