import * as api from '../api'

export const submitVote = async (sessionId: number, optionId: number, token: string) => {
  return api.submitVote(sessionId, optionId, token)
}
