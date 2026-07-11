import { API_ENDPOINTS } from '@/constants/api-endpoints'
import { emptyPage, type ApiResponse } from '@/types/api.types'
import type {
  Review,
  ReviewFilters,
  PaginatedReviewResponse,
  ReviewStatistics,
} from '@/types/review.types'
import apiClient from '@/api/axios'

export async function getReviews(
  params?: ReviewFilters,
): Promise<PaginatedReviewResponse> {
  const { data } = await apiClient.get<ApiResponse<PaginatedReviewResponse>>(
    API_ENDPOINTS.REVIEWS.LIST,
    { params },
  )
  return data.data ?? emptyPage<Review>()
}

export async function getReviewById(id: string): Promise<Review> {
  const { data } = await apiClient.get<ApiResponse<Review>>(
    API_ENDPOINTS.REVIEWS.DETAILS(id),
  )
  return data.data
}

export async function getReviewStatistics(): Promise<ReviewStatistics> {
  const { data } = await apiClient.get<ApiResponse<ReviewStatistics>>(
    API_ENDPOINTS.REVIEWS.STATISTICS,
  )
  return data.data
}
