import * as api from '../api'

export const submitVote = async (sessionId: number, optionId: number) => {
  return api.submitVote(sessionId, optionId)
}
