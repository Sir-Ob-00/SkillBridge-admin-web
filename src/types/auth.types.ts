export type AdminRole = 'student' | 'artisan' | 'admin' | 'super_admin'

export interface Admin {
  id: string
  name: string
  email: string
  role: AdminRole
  phone?: string | null
  profileImageUrl?: string | null
  isSuspended?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user?: Admin
  admin?: Admin
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}
