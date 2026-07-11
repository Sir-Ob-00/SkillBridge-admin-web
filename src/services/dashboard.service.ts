import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  DashboardActivityLog,
  DashboardOverview,
  DashboardStatistics,
} from '@/types/dashboard.types'
import apiClient from '@/api/axios'

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const { data } = await apiClient.get<ApiResponse<DashboardOverview>>(
    API_ENDPOINTS.DASHBOARD.OVERVIEW,
  )
  return data.data
}

export async function getDashboardStats(): Promise<DashboardOverview> {
  const { data } = await apiClient.get<ApiResponse<DashboardOverview>>(
    API_ENDPOINTS.DASHBOARD.STATS,
  )
  return data.data
}

export async function getDashboardStatistics(): Promise<DashboardStatistics> {
  const { data } = await apiClient.get<ApiResponse<DashboardStatistics>>(
    API_ENDPOINTS.DASHBOARD.STATISTICS,
  )
  return data.data
}

export async function getRecentActivities(
  limit = 15,
): Promise<DashboardActivityLog[]> {
  const { data } = await apiClient.get<ApiResponse<DashboardActivityLog[]>>(
    API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES,
    { params: { limit } },
  )
  return data.data
}

export async function getRecentBookings(): Promise<any[]> {
  const { data } = await apiClient.get<ApiResponse<any[]>>(
    API_ENDPOINTS.DASHBOARD.RECENT_BOOKINGS,
  )
  return data.data
}

export async function getRecentReviews(): Promise<any[]> {
  const { data } = await apiClient.get<ApiResponse<any[]>>(
    API_ENDPOINTS.DASHBOARD.RECENT_REVIEWS,
  )
  return data.data
}

export async function getRecentReports(): Promise<any[]> {
  const { data } = await apiClient.get<ApiResponse<any[]>>(
    API_ENDPOINTS.DASHBOARD.RECENT_REPORTS,
  )
  return data.data
}
