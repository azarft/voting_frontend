import * as api from '../api'

export const createVotingSession = async (title: string, options: string[], token: string) => {
  return api.createVotingSession(title, options, token)
}

export const activateVotingSession = async (sessionId: number, token: string) => {
  return api.activateVotingSession(sessionId, token)
}

export const closeVotingSession = async (sessionId: number, token: string) => {
  return api.closeVotingSession(sessionId, token)
}

export const deleteVotingSession = async (sessionId: number, token: string) => {
  return api.deleteVotingSession(sessionId, token)
}

export const getAllSessions = async (token: string) => {
  return api.getAllSessions(token)
}

export const getSessionDetails = async (sessionId: number, token: string) => {
  return api.getSessionDetails(sessionId, token)
}
