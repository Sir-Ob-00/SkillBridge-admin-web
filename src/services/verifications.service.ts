import { API_ENDPOINTS } from '@/constants/api-endpoints'
import { emptyPage, type ApiResponse, type Paginated } from '@/types/api.types'
import type { Artisan } from '@/types/artisan.types'
import apiClient from '@/api/axios'

export type VerificationRequest = Artisan

export type VerificationTab =
  | 'ALL'
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CHANGES_REQUESTED'

interface VerificationTabConfig {
  endpoint: 'artisans' | 'verifications'
  status?: string
}

export const VERIFICATION_TABS: Record<VerificationTab, VerificationTabConfig> = {
  ALL: { endpoint: 'artisans' },
  PENDING: { endpoint: 'verifications', status: 'PENDING_REVIEW' },
  UNDER_REVIEW: { endpoint: 'verifications', status: 'UNDER_REVIEW' },
  APPROVED: { endpoint: 'verifications', status: 'ACTIVE' },
  REJECTED: { endpoint: 'verifications', status: 'REJECTED' },
  CHANGES_REQUESTED: { endpoint: 'verifications', status: 'CHANGES_REQUESTED' },
}

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

/**
 * Dynamic fetch driven by the selected tab.
 *
 * The "All" tab must hit `/admin/artisans` because `/admin/verifications`
 * without a status parameter defaults to `PENDING_REVIEW` and therefore
 * does NOT return all records. Every other tab maps to a status and uses
 * the `/admin/verifications` endpoint.
 */
export async function fetchVerificationArtisans(
  tab: VerificationTab,
  params?: VerificationFilters,
): Promise<PaginatedVerificationResponse> {
  const config = VERIFICATION_TABS[tab]
  const query: VerificationFilters = { ...params }
  if (config.status) {
    query.status = config.status
  } else {
    delete query.status
  }

  const endpoint =
    config.endpoint === 'artisans'
      ? API_ENDPOINTS.ARTISANS.LIST
      : API_ENDPOINTS.VERIFICATIONS.LIST

  const { data } = await apiClient.get<ApiResponse<PaginatedVerificationResponse>>(
    endpoint,
    { params: query },
  )
  return data.data ?? emptyPage<Artisan>()
}

export async function getVerificationById(id: string): Promise<Artisan> {
  const { data } = await apiClient.get<ApiResponse<Artisan>>(
    API_ENDPOINTS.VERIFICATIONS.DETAILS(id),
  )
  return data.data
}

/**
 * Fetch the detailed verification record (documents, services, review notes,
 * etc.) for a given artisan profile. The `:id` is the Artisan Profile UUID,
 * NOT the User UUID.
 */
export async function getVerificationDocuments(id: string): Promise<Artisan> {
  const { data } = await apiClient.get<ApiResponse<Artisan>>(
    API_ENDPOINTS.VERIFICATIONS.DOCUMENTS(id),
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
  payload: { note: string },
): Promise<Artisan> {
  const { data } = await apiClient.post<ApiResponse<Artisan>>(
    API_ENDPOINTS.VERIFICATIONS.REJECT(id),
    payload,
  )
  return data.data
}

export async function requestMoreInformation(
  id: string,
  payload: { note: string },
): Promise<Artisan> {
  const { data } = await apiClient.post<ApiResponse<Artisan>>(
    API_ENDPOINTS.VERIFICATIONS.REQUEST_CHANGES(id),
    payload,
  )
  return data.data
}

export async function addVerificationNote(
  id: string,
  note: string,
): Promise<Artisan> {
  const { data } = await apiClient.post<ApiResponse<Artisan>>(
    API_ENDPOINTS.VERIFICATIONS.ADD_NOTE(id),
    { note },
  )
  return data.data
}

export async function getVerificationStatistics(): Promise<VerificationStatistics> {
  const { data } = await apiClient.get<ApiResponse<VerificationStatistics>>(
    API_ENDPOINTS.VERIFICATIONS.STATISTICS,
  )
  return data.data
}
