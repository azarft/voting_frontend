import { defineStore } from 'pinia'
import type { VotingSession } from '../types/voting'
import {
  activateVotingSession,
  closeVotingSession,
  createVotingSession,
  deleteVotingSession,
  getAllSessions
} from '../services/adminService'
import { useResultsStore } from './results'
import { useAuthStore } from './auth'

interface AdminState {
  sessions: VotingSession[]
  lastCreatedSession: VotingSession | null
  isLoading: boolean
  statusMessage: string | null
  errorMessage: string | null
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    sessions: [],
    lastCreatedSession: null,
    isLoading: false,
    statusMessage: null,
    errorMessage: null
  }),
  actions: {
    async loadSessions() {
      this.isLoading = true
      this.errorMessage = null
      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          throw new Error('You must be logged in as admin.')
        }
        this.sessions = await getAllSessions(authStore.token)
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to load sessions.'
      } finally {
        this.isLoading = false
      }
    },
    async createSession(title: string, options: string[]) {
      this.isLoading = true
      this.statusMessage = null
      this.errorMessage = null
      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          throw new Error('You must be logged in as admin.')
        }
        const session = await createVotingSession(title, options, authStore.token)
        this.lastCreatedSession = session
        this.statusMessage = `Session ${session.id} created`
        await this.loadSessions()
        return session
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to create session.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async activateSession(sessionId: number) {
      this.isLoading = true
      this.statusMessage = null
      this.errorMessage = null
      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          throw new Error('You must be logged in as admin.')
        }
        const message = await activateVotingSession(sessionId, authStore.token)
        this.statusMessage = typeof message === 'string' ? message : 'Session activated'
        await this.loadSessions()
        const resultsStore = useResultsStore()
        resultsStore.stopPolling()
        resultsStore.session = null
        await resultsStore.refreshResults()
        resultsStore.startPolling()
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to activate session.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async closeSession(sessionId: number) {
      this.isLoading = true
      this.statusMessage = null
      this.errorMessage = null
      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          throw new Error('You must be logged in as admin.')
        }
        const message = await closeVotingSession(sessionId, authStore.token)
        this.statusMessage = typeof message === 'string' ? message : 'Session closed'
        await this.loadSessions()
        const resultsStore = useResultsStore()
        resultsStore.stopPolling()
        resultsStore.session = null
        await resultsStore.refreshResults()
        resultsStore.startPolling()
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to close session.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async deleteSession(sessionId: number) {
      this.isLoading = true
      this.statusMessage = null
      this.errorMessage = null
      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          throw new Error('You must be logged in as admin.')
        }
        const message = await deleteVotingSession(sessionId, authStore.token)
        this.statusMessage = typeof message === 'string' ? message : 'Session deleted'
        await this.loadSessions()
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to delete session.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    clearStatus() {
      this.statusMessage = null
      this.errorMessage = null
    }
  }
})
