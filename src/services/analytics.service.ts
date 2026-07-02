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

export async function getOverview(dateRange?: string): Promise<AnalyticsOverview['overview']> {
  const { data } = await apiClient.get<ApiResponse<AnalyticsOverview['overview']>>(
    API_ENDPOINTS.ANALYTICS.OVERVIEW,
    { params: { dateRange } },
  )
  return data.data
}

export async function getUserAnalytics(dateRange?: string): Promise<UserAnalytics> {
  const { data } = await apiClient.get<ApiResponse<UserAnalytics>>(
    API_ENDPOINTS.ANALYTICS.USERS,
    { params: { dateRange } },
  )
  return data.data
}

export async function getBookingAnalytics(dateRange?: string): Promise<BookingAnalytics> {
  const { data } = await apiClient.get<ApiResponse<BookingAnalytics>>(
    API_ENDPOINTS.ANALYTICS.BOOKINGS,
    { params: { dateRange } },
  )
  return data.data
}

export async function getRevenueAnalytics(dateRange?: string): Promise<RevenueAnalytics> {
  const { data } = await apiClient.get<ApiResponse<RevenueAnalytics>>(
    API_ENDPOINTS.ANALYTICS.REVENUE,
    { params: { dateRange } },
  )
  return data.data
}

export async function getCategoryAnalytics(dateRange?: string): Promise<CategoryAnalytics> {
  const { data } = await apiClient.get<ApiResponse<CategoryAnalytics>>(
    API_ENDPOINTS.ANALYTICS.CATEGORIES,
    { params: { dateRange } },
  )
  return data.data
}

export async function getReviewAnalytics(dateRange?: string): Promise<ReviewAnalytics> {
  const { data } = await apiClient.get<ApiResponse<ReviewAnalytics>>(
    API_ENDPOINTS.ANALYTICS.REVIEWS,
    { params: { dateRange } },
  )
  return data.data
}

export async function getReportAnalytics(dateRange?: string): Promise<ReportAnalytics> {
  const { data } = await apiClient.get<ApiResponse<ReportAnalytics>>(
    API_ENDPOINTS.ANALYTICS.REPORTS,
    { params: { dateRange } },
  )
  return data.data
}
