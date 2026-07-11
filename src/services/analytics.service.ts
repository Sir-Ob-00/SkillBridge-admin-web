import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { DashboardAnalytics } from '@/types/analytics.types'
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
