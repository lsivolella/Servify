import { apiPostJson } from './api'

export type LoginResponse = {
  id: number
  perfilId: number
  perfilNome: string
  cargo?: string
  nome: string
  email: string
}

export async function loginApi(login: string, senha: string): Promise<LoginResponse> {
  return apiPostJson<LoginResponse>('/auth/login', { login, senha })
}

