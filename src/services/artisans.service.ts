import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  Artisan,
  ArtisanFilters,
  PaginatedArtisanResponse,
  ArtisanDetails,
  ArtisanPortfolioItem,
  ArtisanReview,
  ArtisanBookingSummary,
  ArtisanDocument,
  VerifyArtisanPayload,
} from '@/types/artisan.types'
import apiClient from '@/api/axios'

export async function getArtisans(
  params?: ArtisanFilters,
): Promise<PaginatedArtisanResponse> {
  const { data } = await apiClient.get<ApiResponse<Artisan[]>>(
    API_ENDPOINTS.ARTISANS.LIST,
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

export async function getArtisanById(id: string): Promise<ArtisanDetails> {
  const { data } = await apiClient.get<ApiResponse<ArtisanDetails>>(
    API_ENDPOINTS.ARTISANS.DETAILS(id),
  )
  return data.data
}

export async function updateArtisanStatus(
  id: string,
  status: 'active' | 'suspended',
): Promise<Artisan> {
  const { data } = await apiClient.patch<ApiResponse<Artisan>>(
    API_ENDPOINTS.ARTISANS.UPDATE_STATUS(id),
    { status },
  )
  return data.data
}

export async function verifyArtisan(
  id: string,
  payload: VerifyArtisanPayload,
): Promise<Artisan> {
  const { data } = await apiClient.patch<ApiResponse<Artisan>>(
    API_ENDPOINTS.ARTISANS.VERIFY(id),
    payload,
  )
  return data.data
}

export async function deleteArtisan(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.ARTISANS.DELETE(id))
}

export async function getArtisanPortfolio(
  id: string,
): Promise<ArtisanPortfolioItem[]> {
  const { data } = await apiClient.get<ApiResponse<ArtisanPortfolioItem[]>>(
    API_ENDPOINTS.ARTISANS.PORTFOLIO(id),
  )
  return data.data
}

export async function getArtisanReviews(id: string): Promise<ArtisanReview[]> {
  const { data } = await apiClient.get<ApiResponse<ArtisanReview[]>>(
    API_ENDPOINTS.ARTISANS.REVIEWS(id),
  )
  return data.data
}

export async function getArtisanBookings(
  id: string,
): Promise<ArtisanBookingSummary[]> {
  const { data } = await apiClient.get<ApiResponse<ArtisanBookingSummary[]>>(
    API_ENDPOINTS.ARTISANS.BOOKINGS(id),
  )
  return data.data
}

export async function getArtisanDocuments(
  id: string,
): Promise<ArtisanDocument[]> {
  const { data } = await apiClient.get<ApiResponse<ArtisanDocument[]>>(
    API_ENDPOINTS.ARTISANS.DOCUMENTS(id),
  )
  return data.data
}
