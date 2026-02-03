import * as api from '../api'

export const requestAuthCode = async (email: string) => {
  return api.requestAuthCode(email)
}

export const verifyAuthCode = async (email: string, code: string) => {
  return api.verifyAuthCode(email, code)
}
