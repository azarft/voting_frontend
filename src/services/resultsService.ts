import * as api from '../api'

export const getLiveResults = async () => {
  return api.getLiveResults()
}

export const getLatestFinalResults = async () => {
  return api.getLatestFinalResults()
}

export const getFinalResultsBySessionId = async (sessionId: number) => {
  return api.getFinalResultsBySessionId(sessionId)
}
