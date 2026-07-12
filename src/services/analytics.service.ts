import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { CategoryUsage, DashboardAnalytics } from '@/types/analytics.types'
import apiClient from '@/api/axios'

export async function getAnalyticsOverview(
  params?: { from?: string; to?: string; days?: number },
): Promise<DashboardAnalytics> {
  const { data } = await apiClient.get<ApiResponse<DashboardAnalytics>>(
    API_ENDPOINTS.ANALYTICS.OVERVIEW,
    { params },
  )
  return data.data
}

export async function getUsersAnalytics(
  params?: { from?: string; to?: string; days?: number },
): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.ANALYTICS.USERS,
    { params },
  )
  return data.data
}

export async function getBookingsAnalytics(
  params?: { from?: string; to?: string; days?: number },
): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.ANALYTICS.BOOKINGS,
    { params },
  )
  return data.data
}

export async function getReviewsAnalytics(
  params?: { from?: string; to?: string; days?: number },
): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.ANALYTICS.REVIEWS,
    { params },
  )
  return data.data
}

export async function getReportsAnalytics(
  params?: { from?: string; to?: string; days?: number },
): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.ANALYTICS.REPORTS,
    { params },
  )
  return data.data
}

export async function getCategoriesAnalytics(
  params?: { from?: string; to?: string; days?: number },
): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.ANALYTICS.CATEGORIES,
    { params },
  )
  return data.data
}

export async function getRevenueAnalytics(
  params?: { from?: string; to?: string; days?: number },
): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.ANALYTICS.REVENUE,
    { params },
  )
  return data.data
}

export async function getTopCategories(): Promise<CategoryUsage[]> {
  const { data } = await apiClient.get<ApiResponse<CategoryUsage[]>>(
    API_ENDPOINTS.ANALYTICS.TOP_CATEGORIES,
  )
  return data.data ?? []
}
