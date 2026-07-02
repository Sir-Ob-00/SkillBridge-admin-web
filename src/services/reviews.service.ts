import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  Review,
  ReviewFilters,
  PaginatedReviewResponse,
  UpdateReviewStatusPayload,
  HideReviewPayload,
  RestoreReviewPayload,
  FlagReviewPayload,
  DeleteReviewPayload,
  ReviewStatistics,
} from '@/types/review.types'
import apiClient from '@/api/axios'

export async function getReviews(
  params?: ReviewFilters,
): Promise<PaginatedReviewResponse> {
  const { data } = await apiClient.get<ApiResponse<Review[]>>(
    API_ENDPOINTS.REVIEWS.LIST,
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

export async function getReviewById(id: string): Promise<Review> {
  const { data } = await apiClient.get<ApiResponse<Review>>(
    API_ENDPOINTS.REVIEWS.DETAILS(id),
  )
  return data.data
}

export async function updateReviewStatus(
  id: string,
  payload: UpdateReviewStatusPayload,
): Promise<Review> {
  const { data } = await apiClient.patch<ApiResponse<Review>>(
    API_ENDPOINTS.REVIEWS.UPDATE_STATUS(id),
    payload,
  )
  return data.data
}

export async function hideReview(
  id: string,
  payload?: HideReviewPayload,
): Promise<Review> {
  const { data } = await apiClient.patch<ApiResponse<Review>>(
    API_ENDPOINTS.REVIEWS.HIDE(id),
    payload,
  )
  return data.data
}

export async function restoreReview(
  id: string,
  payload?: RestoreReviewPayload,
): Promise<Review> {
  const { data } = await apiClient.patch<ApiResponse<Review>>(
    API_ENDPOINTS.REVIEWS.RESTORE(id),
    payload,
  )
  return data.data
}

export async function flagReview(
  id: string,
  payload: FlagReviewPayload,
): Promise<Review> {
  const { data } = await apiClient.patch<ApiResponse<Review>>(
    API_ENDPOINTS.REVIEWS.FLAG(id),
    payload,
  )
  return data.data
}

export async function deleteReview(
  id: string,
  payload: DeleteReviewPayload,
): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.REVIEWS.DELETE(id), { data: payload })
}

export async function getReviewStatistics(): Promise<ReviewStatistics> {
  const { data } = await apiClient.get<ApiResponse<ReviewStatistics>>(
    API_ENDPOINTS.REVIEWS.STATISTICS,
  )
  return data.data
}

export async function exportReviews(
  params?: ReviewFilters,
): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(
    API_ENDPOINTS.REVIEWS.EXPORT,
    {
      params,
      responseType: 'blob',
    },
  )
  return data
}
