import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  Artisan,
  ArtisanFilters,
  PaginatedArtisanResponse,
  ArtisanDetails,
  ArtisanPortfolioItem,
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

export async function getArtisanStatistics(): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.ARTISANS.STATISTICS,
  )
  return data.data
}

export async function exportArtisans(): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.ARTISANS.EXPORT,
  )
  return data.data
}

export async function getArtisanServices(id: string): Promise<any[]> {
  const { data } = await apiClient.get<ApiResponse<any[]>>(
    API_ENDPOINTS.ARTISANS.SERVICES(id),
  )
  return data.data
}

export async function getArtisanAvailability(id: string): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.ARTISANS.AVAILABILITY(id),
  )
  return data.data
}

export async function updateArtisan(
  id: string,
  payload: any,
): Promise<Artisan> {
  const { data } = await apiClient.patch<ApiResponse<Artisan>>(
    API_ENDPOINTS.ARTISANS.UPDATE(id),
    payload,
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
