import { defineStore } from 'pinia'
import { getOptionLabel, type VoteResult, type VotingSession } from '../types/voting'
import { getLatestFinalResults, getLiveResults } from '../services/resultsService'
import { getActiveSession } from '../services/sessionService'

interface ResultsState {
  results: VoteResult[]
  session: VotingSession | null
  isLoading: boolean
  pollingId: ReturnType<typeof setInterval> | null
  errorMessage: string | null
  resultsTitle: string
}

export const useResultsStore = defineStore('results', {
  state: (): ResultsState => ({
    results: [],
    session: null,
    isLoading: false,
    pollingId: null,
    errorMessage: null,
    resultsTitle: 'Audience Vote'
  }),
  actions: {
    async loadSession() {
      if (this.session) return
      this.errorMessage = null
      try {
        const session = await getActiveSession()
        this.session = session ?? null
        if (!session || (session.status && session.status !== 'ACTIVE')) {
          this.errorMessage = 'No active session. Showing last final results.'
        }
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
        if (this.session && this.session.status === 'ACTIVE') {
          const response = await getLiveResults()
          if (!response) {
            this.results = []
            return
          }
          const totalVotes = Object.values(response).reduce((sum, value) => sum + value, 0)
          const responseKeys = Object.keys(response)
          this.resultsTitle = this.session.title
          this.results = this.session.options.map((option) => {
            const label = getOptionLabel(option)
            const fallbackLabel = !label && responseKeys.length ? responseKeys[this.session?.options.indexOf(option) ?? 0] : ''
            const resolvedLabel = label || fallbackLabel || `Option ${option.id}`
            const votes = response[resolvedLabel] ?? 0
            return {
              optionId: option.id,
              label: resolvedLabel,
              votes,
              percentage: totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100)
            }
          })
        } else {
          const response = await getLatestFinalResults()
          if (!response) {
            this.resultsTitle = 'Latest Final Results'
            this.results = []
            return
          }
          const totalVotes = Object.values(response).reduce((sum, value) => sum + value, 0)
          this.resultsTitle = 'Latest Final Results'
          this.results = Object.entries(response).map(([label, votes], index) => ({
            optionId: index + 1,
            label,
            votes,
            percentage: totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100)
          }))
        }
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
