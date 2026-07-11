import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { SystemSettings, UpdateSettingsPayload } from '@/types/settings.types'
import apiClient from '@/api/axios'

export async function getSettings(): Promise<SystemSettings> {
  const { data } = await apiClient.get<ApiResponse<SystemSettings>>(
    API_ENDPOINTS.SETTINGS.GET,
  )
  return data.data
}

export async function updateSettings(payload: UpdateSettingsPayload): Promise<SystemSettings> {
  const { data } = await apiClient.patch<ApiResponse<SystemSettings>>(
    API_ENDPOINTS.SETTINGS.UPDATE,
    payload,
  )
  return data.data
}
