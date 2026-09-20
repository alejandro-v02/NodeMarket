import { apiFetch } from './client'
import type { SelfRegisterableRole, UserResponse } from './types'

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: SelfRegisterableRole
}

export function registerUser(payload: RegisterPayload): Promise<UserResponse> {
  return apiFetch<UserResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function loginUser(email: string, password: string): Promise<{ accessToken: string }> {
  return apiFetch<{ accessToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}
