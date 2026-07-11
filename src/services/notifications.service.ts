import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import apiClient from '@/api/axios'

export async function getNotifications(params?: any): Promise<any[]> {
  const { data } = await apiClient.get<ApiResponse<any[]>>(
    API_ENDPOINTS.NOTIFICATIONS.LIST,
    { params },
  )
  return data.data
}

export async function getNotificationStatistics(): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.NOTIFICATIONS.STATISTICS,
  )
  return data.data
}

export async function createNotification(payload: any): Promise<any> {
  const { data } = await apiClient.post<ApiResponse<any>>(
    API_ENDPOINTS.NOTIFICATIONS.CREATE,
    payload,
  )
  return data.data
}

export async function broadcastNotification(payload: any): Promise<any> {
  const { data } = await apiClient.post<ApiResponse<any>>(
    API_ENDPOINTS.NOTIFICATIONS.BROADCAST,
    payload,
  )
  return data.data
}

export async function updateNotification(id: string, payload: any): Promise<any> {
  const { data } = await apiClient.patch<ApiResponse<any>>(
    API_ENDPOINTS.NOTIFICATIONS.UPDATE(id),
    payload,
  )
  return data.data
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id))
}
