import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  AnalyticsOverview,
  UserAnalytics,
  BookingAnalytics,
  RevenueAnalytics,
  CategoryAnalytics,
  ReviewAnalytics,
  ReportAnalytics,
} from '@/types/analytics.types'
import apiClient from '@/api/axios'

export async function getAnalytics(params?: { from?: string; to?: string; days?: number }): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.ANALYTICS.BASE,
    { params },
  )
  return data.data
}

export async function getOverview(params?: { from?: string; to?: string; days?: number }): Promise<AnalyticsOverview['overview']> {
  const { data } = await apiClient.get<ApiResponse<AnalyticsOverview['overview']>>(
    API_ENDPOINTS.ANALYTICS.OVERVIEW,
    { params },
  )
  return data.data
}

export async function getUserAnalytics(params?: { from?: string; to?: string; days?: number }): Promise<UserAnalytics> {
  const { data } = await apiClient.get<ApiResponse<UserAnalytics>>(
    API_ENDPOINTS.ANALYTICS.USERS,
    { params },
  )
  return data.data
}

export async function getBookingAnalytics(params?: { from?: string; to?: string; days?: number }): Promise<BookingAnalytics> {
  const { data } = await apiClient.get<ApiResponse<BookingAnalytics>>(
    API_ENDPOINTS.ANALYTICS.BOOKINGS,
    { params },
  )
  return data.data
}

export async function getRevenueAnalytics(params?: { from?: string; to?: string; days?: number }): Promise<RevenueAnalytics> {
  const { data } = await apiClient.get<ApiResponse<RevenueAnalytics>>(
    API_ENDPOINTS.ANALYTICS.REVENUE,
    { params },
  )
  return data.data
}

export async function getCategoryAnalytics(params?: { from?: string; to?: string; days?: number }): Promise<CategoryAnalytics> {
  const { data } = await apiClient.get<ApiResponse<CategoryAnalytics>>(
    API_ENDPOINTS.ANALYTICS.CATEGORIES,
    { params },
  )
  return data.data
}

export async function getReviewAnalytics(params?: { from?: string; to?: string; days?: number }): Promise<ReviewAnalytics> {
  const { data } = await apiClient.get<ApiResponse<ReviewAnalytics>>(
    API_ENDPOINTS.ANALYTICS.REVIEWS,
    { params },
  )
  return data.data
}

export async function getReportAnalytics(params?: { from?: string; to?: string; days?: number }): Promise<ReportAnalytics> {
  const { data } = await apiClient.get<ApiResponse<ReportAnalytics>>(
    API_ENDPOINTS.ANALYTICS.REPORTS,
    { params },
  )
  return data.data
}
