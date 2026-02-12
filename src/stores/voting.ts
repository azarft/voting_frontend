import { defineStore } from 'pinia'
import type { VotingOption, VotingSession } from '../types/voting'
import { getActiveSession } from '../services/sessionService'
import { submitVote } from '../services/votingService'
import { useAuthStore } from './auth'

interface VotingState {
  session: VotingSession | null
  selectedOptionId: number | null
  isSubmitting: boolean
  hasVoted: boolean
  statusMessage: string | null
  errorMessage: string | null
}

export const useVotingStore = defineStore('voting', {
  state: (): VotingState => ({
    session: null,
    selectedOptionId: null,
    isSubmitting: false,
    hasVoted: false,
    statusMessage: null,
    errorMessage: null
  }),
  getters: {
    options: (state): VotingOption[] => state.session?.options ?? [],
    sessionTitle: (state) => state.session?.title ?? 'Live Voting Session',
    isActive: (state) => state.session?.status === 'ACTIVE'
  },
  actions: {
    async loadSession(force = false) {
      if (this.session && !force) return
      this.errorMessage = null
      try {
        const session = await getActiveSession()
        this.session = session ?? null
        if (!session) {
          this.errorMessage = 'No active session right now.'
          return
        }
        if (session.status && session.status !== 'ACTIVE') {
          this.errorMessage = 'No active session right now.'
        }
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to load session.'
      }
    },
    selectOption(optionId: number) {
      if (this.hasVoted || !this.isActive) return
      this.selectedOptionId = optionId
    },
    async submitSelectedVote() {
      if (this.selectedOptionId === null || this.hasVoted || !this.session) return
      if (this.session.status && this.session.status !== 'ACTIVE') {
        this.errorMessage = 'Voting is not active.'
        return
      }
      this.isSubmitting = true
      this.statusMessage = null
      this.errorMessage = null
      try {
        const authStore = useAuthStore()
        if (authStore.isAdmin) {
          throw new Error('Admins cannot vote in sessions.')
        }
        await submitVote(this.session.id, this.selectedOptionId)
        this.hasVoted = true
        this.statusMessage = 'Vote submitted'
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to submit vote.'
      } finally {
        this.isSubmitting = false
      }
    },
    resetVote() {
      this.selectedOptionId = null
      this.hasVoted = false
      this.statusMessage = null
      this.errorMessage = null
    }
  }
})
