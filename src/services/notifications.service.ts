import { API_ENDPOINTS } from '@/constants/api-endpoints'
import { emptyPage, type ApiResponse } from '@/types/api.types'
import type {
  Notification,
  NotificationFilters,
  PaginatedNotificationResponse,
  NotificationStatistics,
  CreateNotificationPayload,
  BroadcastNotificationPayload,
  UpdateNotificationPayload,
} from '@/types/notification.types'
import apiClient from '@/api/axios'

export async function getNotifications(
  params?: NotificationFilters,
): Promise<PaginatedNotificationResponse> {
  const { data } = await apiClient.get<ApiResponse<PaginatedNotificationResponse>>(
    API_ENDPOINTS.NOTIFICATIONS.LIST,
    { params },
  )
  return data.data ?? emptyPage<Notification>()
}

export async function getNotificationStatistics(): Promise<NotificationStatistics> {
  const { data } = await apiClient.get<ApiResponse<NotificationStatistics>>(
    API_ENDPOINTS.NOTIFICATIONS.STATISTICS,
  )
  return data.data
}

export async function createNotification(
  payload: CreateNotificationPayload,
): Promise<Notification> {
  const { data } = await apiClient.post<ApiResponse<Notification>>(
    API_ENDPOINTS.NOTIFICATIONS.CREATE,
    payload,
  )
  return data.data
}

export async function broadcastNotification(
  payload: BroadcastNotificationPayload,
): Promise<void> {
  await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.BROADCAST, payload)
}

export async function updateNotification(
  id: string,
  payload: UpdateNotificationPayload,
): Promise<Notification> {
  const { data } = await apiClient.patch<ApiResponse<Notification>>(
    API_ENDPOINTS.NOTIFICATIONS.UPDATE(id),
    payload,
  )
  return data.data
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id))
}
