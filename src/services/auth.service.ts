import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  Admin,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginCredentials,
  LoginResponse,
} from '@/types/auth.types'
import apiClient from '@/api/axios'

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials,
  )
  
  // Debug: Log the raw response
  console.log('[AUTH SERVICE DEBUG] Raw login response:', JSON.stringify(data, null, 2))
  
  // The backend returns 'admin' but our types expect 'user'
  // Map it to match our type definition
  const responseData = data.data as any
  if (responseData.admin && !responseData.user) {
    console.log('[AUTH SERVICE DEBUG] Mapping admin to user for type compatibility')
    responseData.user = responseData.admin
  }
  
  return data.data
}

export async function logout(): Promise<void> {
  await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> {
  const { data } = await apiClient.post<ApiResponse<ForgotPasswordResponse>>(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    payload,
  )
  return data.data
}

export async function getCurrentAdmin(): Promise<Admin> {
  const { data } = await apiClient.get<ApiResponse<Admin>>(
    API_ENDPOINTS.AUTH.ME,
  )
  return data.data
}
