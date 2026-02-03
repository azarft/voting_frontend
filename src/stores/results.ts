import { defineStore } from 'pinia'
import type { VoteResult, VotingSession } from '../types/voting'
import { getLiveResults } from '../services/resultsService'
import { getActiveSession } from '../services/sessionService'

interface ResultsState {
  results: VoteResult[]
  session: VotingSession | null
  isLoading: boolean
  pollingId: ReturnType<typeof setInterval> | null
  errorMessage: string | null
}

export const useResultsStore = defineStore('results', {
  state: (): ResultsState => ({
    results: [],
    session: null,
    isLoading: false,
    pollingId: null,
    errorMessage: null
  }),
  actions: {
    async loadSession() {
      if (this.session) return
      this.errorMessage = null
      try {
        const session = await getActiveSession()
        this.session = session
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to load session.'
      }
    },
    async refreshResults() {
      this.isLoading = true
      this.errorMessage = null
      try {
        if (!this.session) {
          await this.loadSession()
        }
        if (!this.session) return
        const response = await getLiveResults()
        const totalVotes = Object.values(response).reduce((sum, value) => sum + value, 0)
        this.results = this.session.options.map((option) => {
          const votes = response[option.text] ?? 0
          return {
            optionId: option.id,
            label: option.text,
            votes,
            percentage: totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100)
          }
        })
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Failed to load results.'
      } finally {
        this.isLoading = false
      }
    },
    startPolling(intervalMs = 2500) {
      if (this.pollingId) return
      this.refreshResults()
      this.pollingId = setInterval(() => {
        this.refreshResults()
      }, intervalMs)
    },
    stopPolling() {
      if (!this.pollingId) return
      clearInterval(this.pollingId)
      this.pollingId = null
    }
  }
})
