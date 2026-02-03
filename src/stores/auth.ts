import { defineStore } from 'pinia'
import { requestAuthCode, verifyAuthCode } from '../services/authService'

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
    isAuthenticated: (state) => Boolean(state.token)
  },
  actions: {
    async requestCode(email: string) {
      this.isLoading = true
      try {
        await requestAuthCode(email)
        this.email = email
        localStorage.setItem(EMAIL_KEY, email)
      } finally {
        this.isLoading = false
      }
    },
    async verifyCode(email: string, code: string) {
      this.isLoading = true
      try {
        const response = await verifyAuthCode(email, code)
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
