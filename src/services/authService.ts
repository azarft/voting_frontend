import * as api from '../api'

export const loginAdmin = async (email: string, password: string) => {
  return api.loginAdmin(email, password)
}
