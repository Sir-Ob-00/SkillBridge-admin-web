import { API_ENDPOINTS } from '@/constants/api-endpoints'
import { emptyPage, type ApiResponse } from '@/types/api.types'
import type {
  Artisan,
  ArtisanFilters,
  PaginatedArtisanResponse,
  ArtisanStatistics,
  ArtisanDetails,
} from '@/types/artisan.types'
import apiClient from '@/api/axios'

export async function getArtisans(
  params?: ArtisanFilters,
): Promise<PaginatedArtisanResponse> {
  const { data } = await apiClient.get<ApiResponse<PaginatedArtisanResponse>>(
    API_ENDPOINTS.ARTISANS.LIST,
    { params },
  )
  return data.data ?? emptyPage<Artisan>()
}

export async function getArtisanStatistics(): Promise<ArtisanStatistics> {
  const { data } = await apiClient.get<ApiResponse<ArtisanStatistics>>(
    API_ENDPOINTS.ARTISANS.STATISTICS,
  )
  return data.data
}

export async function getArtisanById(id: string): Promise<ArtisanDetails> {
  const { data } = await apiClient.get<ApiResponse<ArtisanDetails>>(
    API_ENDPOINTS.ARTISANS.DETAILS(id),
  )
  return data.data
}

export async function suspendArtisan(id: string): Promise<Artisan> {
  const { data } = await apiClient.patch<ApiResponse<Artisan>>(
    API_ENDPOINTS.ARTISANS.SUSPEND(id),
  )
  return data.data
}

export async function unsuspendArtisan(id: string): Promise<Artisan> {
  const { data } = await apiClient.patch<ApiResponse<Artisan>>(
    API_ENDPOINTS.ARTISANS.UNSUSPEND(id),
  )
  return data.data
}
