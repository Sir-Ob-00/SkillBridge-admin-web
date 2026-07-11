import { API_ENDPOINTS } from '@/constants/api-endpoints'
import { emptyPage, type ApiResponse, type Paginated } from '@/types/api.types'
import type { Artisan } from '@/types/artisan.types'
import apiClient from '@/api/axios'

export type VerificationRequest = Artisan

export interface VerificationFilters {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export interface VerificationStatistics {
  pending: number
  underReview: number
  changesRequested: number
  active: number
  rejected: number
  total: number
}

export type PaginatedVerificationResponse = Paginated<Artisan>

export async function getVerificationRequests(
  params?: VerificationFilters,
): Promise<PaginatedVerificationResponse> {
  const { data } = await apiClient.get<ApiResponse<PaginatedVerificationResponse>>(
    API_ENDPOINTS.VERIFICATIONS.LIST,
    { params },
  )
  return data.data ?? emptyPage<Artisan>()
}

export async function getVerificationById(id: string): Promise<Artisan> {
  const { data } = await apiClient.get<ApiResponse<Artisan>>(
    API_ENDPOINTS.VERIFICATIONS.DETAILS(id),
  )
  return data.data
}

export async function approveVerification(
  id: string,
  payload?: { note?: string },
): Promise<Artisan> {
  const { data } = await apiClient.post<ApiResponse<Artisan>>(
    API_ENDPOINTS.VERIFICATIONS.APPROVE(id),
    payload,
  )
  return data.data
}

export async function rejectVerification(
  id: string,
  payload: { reason: string },
): Promise<Artisan> {
  const { data } = await apiClient.post<ApiResponse<Artisan>>(
    API_ENDPOINTS.VERIFICATIONS.REJECT(id),
    payload,
  )
  return data.data
}

export async function requestMoreInformation(
  id: string,
  payload: { message: string },
): Promise<Artisan> {
  const { data } = await apiClient.post<ApiResponse<Artisan>>(
    API_ENDPOINTS.VERIFICATIONS.REQUEST_CHANGES(id),
    payload,
  )
  return data.data
}

export async function getVerificationStatistics(): Promise<VerificationStatistics> {
  const { data } = await apiClient.get<ApiResponse<VerificationStatistics>>(
    API_ENDPOINTS.VERIFICATIONS.STATISTICS,
  )
  return data.data
}
