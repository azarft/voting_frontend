import type { VotingSession } from '../types/voting'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const tryParseJson = <T>(text: string): T | null => {
  if (!text) return null
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

const request = async <T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> => {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  })

  const text = await response.text()
  const json = tryParseJson<T>(text)

  if (!response.ok) {
    const errorPayload = tryParseJson<{ message?: string }>(text)
    const errorText = errorPayload?.message ?? text ?? response.statusText ?? 'Request failed'
    throw new Error(errorText)
  }

  if (json !== null) {
    return json
  }

  if (text) {
    return text as T
  }

  return {} as T
}

export const requestAuthCode = async (email: string) => {
  await request('/auth/request-code', {
    method: 'POST',
    body: JSON.stringify({ email })
  })
}

export const verifyAuthCode = async (email: string, code: string) => {
  return request<{ token: string }>('/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify({ email, code })
  })
}

export const getActiveSession = async () => {
  return request<VotingSession>('/session/active', {
    method: 'GET'
  })
}

export const submitVote = async (sessionId: number, optionId: number, token: string) => {
  return request('/vote', {
    method: 'POST',
    body: JSON.stringify({ sessionId, optionId })
  }, token)
}

export const getLiveResults = async () => {
  return request<Record<string, number>>('/results/live', {
    method: 'GET'
  })
}

export const getFinalResults = async (sessionId: number) => {
  return request<Record<string, number>>(`/results/final?sessionId=${sessionId}`, {
    method: 'GET'
  })
}

export const createVotingSession = async (title: string, options: string[], token: string) => {
  return request<VotingSession>('/admin/session', {
    method: 'POST',
    body: JSON.stringify({ title, options })
  }, token)
}

export const activateVotingSession = async (sessionId: number, token: string) => {
  return request<string>(`/admin/session/activate/${sessionId}`, {
    method: 'POST'
  }, token)
}

export const closeVotingSession = async (sessionId: number, token: string) => {
  return request<string>(`/admin/session/close/${sessionId}`, {
    method: 'POST'
  }, token)
}

export const deleteVotingSession = async (sessionId: number, token: string) => {
  return request<string>(`/admin/session/${sessionId}`, {
    method: 'DELETE'
  }, token)
}

export const getAllSessions = async (token: string) => {
  return request<VotingSession[]>('/admin/session', {
    method: 'GET'
  }, token)
}

export const getSessionDetails = async (sessionId: number, token: string) => {
  return request<VotingSession>(`/admin/session/${sessionId}`, {
    method: 'GET'
  }, token)
}
