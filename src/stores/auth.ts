import { defineStore } from 'pinia'
import { loginAdmin } from '../services/authService'

const TOKEN_KEY = 'tv_voting_token'
const EMAIL_KEY = 'tv_voting_email'

interface AuthState {
  token: string | null
  email: string | null
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem(TOKEN_KEY),
    email: localStorage.getItem(EMAIL_KEY),
    isLoading: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    isAdmin: (state) => Boolean(state.token)
  },
  actions: {
    async login(email: string, password: string) {
      this.isLoading = true
      try {
        const response = await loginAdmin(email, password)
        if (!response?.token) {
          throw new Error('Invalid login response.')
        }
        this.token = response.token
        this.email = email
        localStorage.setItem(TOKEN_KEY, response.token)
        localStorage.setItem(EMAIL_KEY, email)
      } finally {
        this.isLoading = false
      }
    },
    logout() {
      this.token = null
      this.email = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(EMAIL_KEY)
    }
  }
})
