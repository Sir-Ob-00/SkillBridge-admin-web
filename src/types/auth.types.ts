import type { Role } from '@/constants/roles'
import type { Permission } from '@/constants/permissions'

export interface Admin {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string | null
  roles: Role[]
  permissions: Permission[]
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  admin: Admin
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}
