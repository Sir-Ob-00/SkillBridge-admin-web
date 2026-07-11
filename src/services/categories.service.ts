import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  Category,
  CategoryFilters,
  PaginatedCategoryResponse,
  CategoryForm,
  CategoryOrder,
} from '@/types/category.types'
import apiClient from '@/api/axios'

export async function getCategories(
  params?: CategoryFilters,
): Promise<PaginatedCategoryResponse> {
  const { data } = await apiClient.get<ApiResponse<Category[]>>(
    API_ENDPOINTS.CATEGORIES.LIST,
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

export async function getCategoryById(id: string): Promise<Category> {
  const { data } = await apiClient.get<ApiResponse<Category>>(
    API_ENDPOINTS.CATEGORIES.DETAILS(id),
  )
  return data.data
}

export async function createCategory(
  payload: CategoryForm,
): Promise<Category> {
  const { data } = await apiClient.post<ApiResponse<Category>>(
    API_ENDPOINTS.CATEGORIES.CREATE,
    payload,
  )
  return data.data
}

export async function updateCategory(
  id: string,
  payload: CategoryForm,
): Promise<Category> {
  const { data } = await apiClient.patch<ApiResponse<Category>>(
    API_ENDPOINTS.CATEGORIES.UPDATE(id),
    payload,
  )
  return data.data
}

export async function updateCategoryStatus(
  id: string,
  status: 'active' | 'archived' | 'hidden',
): Promise<Category> {
  const { data } = await apiClient.patch<ApiResponse<Category>>(
    API_ENDPOINTS.CATEGORIES.UPDATE_STATUS(id),
    { status },
  )
  return data.data
}

export async function reorderCategories(
  payload: CategoryOrder[],
): Promise<void> {
  await apiClient.patch(API_ENDPOINTS.CATEGORIES.REORDER, payload)
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id))
}

export async function getCategoryStatistics(): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.CATEGORIES.STATISTICS,
  )
  return data.data
}
