import { API_ENDPOINTS } from '@/constants/api-endpoints'
import { emptyPage, type ApiResponse, type Paginated } from '@/types/api.types'
import type {
  Category,
  CategoryFilters,
  CategoryForm,
  CategoryStatistics,
  CategoryList,
} from '@/types/category.types'
import apiClient from '@/api/axios'

// GET /admin/categories returns a RAW array (no pagination wrapper).
export async function getCategories(
  params?: CategoryFilters,
): Promise<CategoryList> {
  console.log('Categories API raw params:', params)

  const cleanParams: Record<string, string> = {}

  if (params?.search && params.search.trim()) {
    cleanParams.search = params.search.trim()
  }

  if (typeof params?.activeOnly === 'boolean') {
    cleanParams.activeOnly = params.activeOnly ? 'true' : 'false'
  }

  console.log('Categories API cleanParams:', cleanParams)

  const { data } = await apiClient.get<ApiResponse<CategoryList>>(
    API_ENDPOINTS.CATEGORIES.LIST,
    Object.keys(cleanParams).length > 0 ? { params: cleanParams } : undefined,
  )
  return data.data ?? []
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

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id))
}

export async function getCategoryStatistics(): Promise<CategoryStatistics> {
  const { data } = await apiClient.get<ApiResponse<CategoryStatistics>>(
    API_ENDPOINTS.CATEGORIES.STATISTICS,
  )
  return data.data
}

/** Helper kept for callers expecting a paginated shape. */
export async function getCategoriesPaginated(
  params?: CategoryFilters,
): Promise<Paginated<Category>> {
  const items = await getCategories(params)
  return items.length ? { items, page: 1, totalPages: 1, totalItems: items.length } : emptyPage<Category>()
}
