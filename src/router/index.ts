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
      component: VotingView
    },
    {
      path: '/results',
      name: 'results',
      component: ResultsView
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
    const isAdminEmail = authStore.isAdmin

    if (to.name === 'login' && isAdminEmail) {
      return { path: '/admin' }
    }

    if (to.meta.requiresAdmin && !isAdminEmail) {
      return { path: '/login' }
    }

    if (to.name === 'vote' && isAdminEmail) {
      return { path: '/results' }
    }

    return true
  })
}
