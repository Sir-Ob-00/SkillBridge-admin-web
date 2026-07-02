import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  VerificationRequest,
  VerificationFilters,
  PaginatedVerificationResponse,
  VerificationDocument,
  ApproveVerificationPayload,
  RejectVerificationPayload,
  RequestMoreInfoPayload,
  VerificationStatistics,
} from '@/types/verification.types'
import apiClient from '@/api/axios'

export async function getVerificationRequests(
  params?: VerificationFilters,
): Promise<PaginatedVerificationResponse> {
  const { data } = await apiClient.get<ApiResponse<VerificationRequest[]>>(
    API_ENDPOINTS.VERIFICATIONS.LIST,
    { params },
  )
  
  return {
    data: data.data,
    meta: {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: data.data.length,
      totalPages: Math.ceil(data.data.length / (params?.limit || 10)),
    },
  }
}

export async function getVerificationById(id: string): Promise<VerificationRequest> {
  const { data } = await apiClient.get<ApiResponse<VerificationRequest>>(
    API_ENDPOINTS.VERIFICATIONS.DETAILS(id),
  )
  return data.data
}

export async function approveVerification(
  id: string,
  payload?: ApproveVerificationPayload,
): Promise<VerificationRequest> {
  const { data } = await apiClient.patch<ApiResponse<VerificationRequest>>(
    API_ENDPOINTS.VERIFICATIONS.APPROVE(id),
    payload,
  )
  return data.data
}

export async function rejectVerification(
  id: string,
  payload: RejectVerificationPayload,
): Promise<VerificationRequest> {
  const { data } = await apiClient.patch<ApiResponse<VerificationRequest>>(
    API_ENDPOINTS.VERIFICATIONS.REJECT(id),
    payload,
  )
  return data.data
}

export async function requestMoreInformation(
  id: string,
  payload: RequestMoreInfoPayload,
): Promise<VerificationRequest> {
  const { data } = await apiClient.patch<ApiResponse<VerificationRequest>>(
    API_ENDPOINTS.VERIFICATIONS.REQUEST_INFO(id),
    payload,
  )
  return data.data
}

export async function getVerificationDocuments(
  id: string,
): Promise<VerificationDocument[]> {
  const { data } = await apiClient.get<ApiResponse<VerificationDocument[]>>(
    API_ENDPOINTS.VERIFICATIONS.DOCUMENTS(id),
  )
  return data.data
}

export async function getVerificationStatistics(): Promise<VerificationStatistics> {
  const { data } = await apiClient.get<ApiResponse<VerificationStatistics>>(
    API_ENDPOINTS.VERIFICATIONS.STATISTICS,
  )
  return data.data
}
