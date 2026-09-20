export const UserRole = {
  CLIENT: 'client',
  PROVIDER: 'provider',
  ADMIN: 'admin',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

// Self-registration only allows these two; ADMIN is created separately
// (see nodemarket-backend's seed:admin script).
export type SelfRegisterableRole = typeof UserRole.CLIENT | typeof UserRole.PROVIDER

export interface UserResponse {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  isActive: boolean
}

export interface Category {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
}
