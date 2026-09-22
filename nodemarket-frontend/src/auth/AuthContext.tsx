import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { loginUser, registerUser } from '../api/auth'
import { AuthContext } from './context'
import type { AuthUser } from './context'
import { decodeJwt, isExpired } from './jwt'

const TOKEN_STORAGE_KEY = 'nodemarket_token'

function userFromToken(token: string): AuthUser | null {
  try {
    const payload = decodeJwt(token)
    if (isExpired(payload)) return null
    return { userId: payload.sub, email: payload.email, role: payload.role }
  } catch {
    return null
  }
}

function readStoredToken(): { token: string | null; user: AuthUser | null } {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!stored) return { token: null, user: null }

  const user = userFromToken(stored)
  if (!user) {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    return { token: null, user: null }
  }
  return { token: stored, user }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ token, user }, setSession] = useState(readStoredToken)

  const applyToken = useCallback((accessToken: string) => {
    const decodedUser = userFromToken(accessToken)
    if (!decodedUser) {
      throw new Error('Received an invalid session token')
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
    setSession({ token: accessToken, user: decodedUser })
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const { accessToken } = await loginUser(email, password)
      applyToken(accessToken)
    },
    [applyToken],
  )

  const register = useCallback(
    async (payload: Parameters<typeof registerUser>[0]) => {
      await registerUser(payload)
      const { accessToken } = await loginUser(payload.email, payload.password)
      applyToken(accessToken)
    },
    [applyToken],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setSession({ token: null, user: null })
  }, [])

  const value = useMemo(
    () => ({ user, token, login, register, logout }),
    [user, token, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
