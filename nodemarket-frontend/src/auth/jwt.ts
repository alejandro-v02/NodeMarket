import type { UserRole } from '../api/types'

export interface JwtPayload {
  sub: string
  email: string
  role: UserRole
  iat: number
  exp: number
}

// Decodes the token locally just to read its claims (id/email/role/expiry)
// for the UI. The backend is the only party that verifies the signature.
export function decodeJwt(token: string): JwtPayload {
  const payload = token.split('.')[1]
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(''),
  )
  return JSON.parse(json) as JwtPayload
}

export function isExpired(payload: JwtPayload): boolean {
  return payload.exp * 1000 <= Date.now()
}
