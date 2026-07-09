import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  ArtisanApplication,
  ApplicationFilters,
  PaginatedApplicationResponse,
  ApplicationStatistics,
  ApproveApplicationPayload,
  RejectApplicationPayload,
  RequestChangesPayload,
} from '@/types/artisanApplication.types'
import apiClient from '@/api/axios'

export async function getApplications(filters?: ApplicationFilters): Promise<PaginatedApplicationResponse> {
  const { data } = await apiClient.get<ApiResponse<PaginatedApplicationResponse>>(
    API_ENDPOINTS.ARTISAN_APPLICATIONS.LIST,
    { params: filters },
  )
  return data.data
}

export async function getApplicationById(id: string): Promise<ArtisanApplication> {
  const { data } = await apiClient.get<ApiResponse<ArtisanApplication>>(
    API_ENDPOINTS.ARTISAN_APPLICATIONS.DETAILS(id),
  )
  return data.data
}

export async function getApplicationStatistics(): Promise<ApplicationStatistics> {
  const { data } = await apiClient.get<ApiResponse<ApplicationStatistics>>(
    API_ENDPOINTS.ARTISAN_APPLICATIONS.STATISTICS,
  )
  return data.data
}

export async function approveApplication(id: string, payload: ApproveApplicationPayload): Promise<ArtisanApplication> {
  const { data } = await apiClient.post<ApiResponse<ArtisanApplication>>(
    API_ENDPOINTS.ARTISAN_APPLICATIONS.APPROVE(id),
    payload,
  )
  return data.data
}

export async function rejectApplication(id: string, payload: RejectApplicationPayload): Promise<ArtisanApplication> {
  const { data } = await apiClient.post<ApiResponse<ArtisanApplication>>(
    API_ENDPOINTS.ARTISAN_APPLICATIONS.REJECT(id),
    payload,
  )
  return data.data
}

export async function requestChanges(id: string, payload: RequestChangesPayload): Promise<ArtisanApplication> {
  const { data } = await apiClient.post<ApiResponse<ArtisanApplication>>(
    API_ENDPOINTS.ARTISAN_APPLICATIONS.REQUEST_CHANGES(id),
    payload,
  )
  return data.data
}

export async function updateApplicationStatus(id: string, status: string, notes?: string): Promise<ArtisanApplication> {
  const { data } = await apiClient.patch<ApiResponse<ArtisanApplication>>(
    API_ENDPOINTS.ARTISAN_APPLICATIONS.UPDATE_STATUS(id),
    { status, notes },
  )
  return data.data
}
