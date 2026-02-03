import * as api from '../api'

export const getLiveResults = async () => {
  return api.getLiveResults()
}

export const getFinalResults = async (sessionId: number) => {
  return api.getFinalResults(sessionId)
}
