import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import apiClient from '@/api/axios'

export async function getProfile(): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.PROFILE.GET,
  )
  return data.data
}

export async function updateProfile(payload: any): Promise<any> {
  const { data } = await apiClient.patch<ApiResponse<any>>(
    API_ENDPOINTS.PROFILE.UPDATE,
    payload,
  )
  return data.data
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }): Promise<any> {
  const { data } = await apiClient.patch<ApiResponse<any>>(
    API_ENDPOINTS.PROFILE.CHANGE_PASSWORD,
    payload,
  )
  return data.data
}

export async function uploadAvatar(payload: FormData): Promise<any> {
  const { data } = await apiClient.patch<ApiResponse<any>>(
    API_ENDPOINTS.PROFILE.UPLOAD_AVATAR,
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return data.data
}
