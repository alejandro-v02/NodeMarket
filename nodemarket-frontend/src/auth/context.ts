import { createContext } from 'react'
import type { RegisterPayload } from '../api/auth'
import type { UserRole } from '../api/types'

export interface AuthUser {
  userId: string
  email: string
  role: UserRole
}

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
