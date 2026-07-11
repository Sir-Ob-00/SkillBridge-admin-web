import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { DashboardResponse } from '@/types/dashboard.types'
import apiClient from '@/api/axios'

export async function getDashboardOverview(): Promise<DashboardResponse> {
  const { data } = await apiClient.get<ApiResponse<DashboardResponse>>(
    API_ENDPOINTS.DASHBOARD.OVERVIEW,
  )
  return data.data
}

export async function getDashboardStats(): Promise<DashboardResponse> {
  const { data } = await apiClient.get<ApiResponse<DashboardResponse>>(
    API_ENDPOINTS.DASHBOARD.STATS,
  )
  return data.data
}

export async function getDashboardStatistics(): Promise<DashboardResponse> {
  const { data } = await apiClient.get<ApiResponse<DashboardResponse>>(
    API_ENDPOINTS.DASHBOARD.STATISTICS,
  )
  return data.data
}

export async function getRecentActivities(): Promise<any[]> {
  const { data } = await apiClient.get<ApiResponse<any[]>>(
    API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES,
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
