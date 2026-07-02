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
