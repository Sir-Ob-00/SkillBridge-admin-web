import { API_ENDPOINTS } from '@/constants/api-endpoints'
import { type ApiResponse } from '@/types/api.types'
import type {
  Admin,
  PaginatedAdminResponse,
  CreateAdminPayload,
  UpdateAdminPayload,
  UpdateAdminStatusPayload,
  AdminFilters,
} from '@/types/admin.types'
import apiClient from '@/api/axios'

export async function getAdmins(filters?: AdminFilters): Promise<PaginatedAdminResponse | null> {
  interface BackendPaginatedResponse {
    items: Admin[]
    meta: { page: number; pageSize: number; totalItems: number; totalPages: number }
  }
  const { data } = await apiClient.get<ApiResponse<BackendPaginatedResponse>>(
    API_ENDPOINTS.USERS.ADMINS,
    { params: filters },
  )
  if (!data.data?.items) return null
  return {
    data: data.data.items,
    total: data.data.meta.totalItems,
    page: data.data.meta.page,
    limit: data.data.meta.pageSize,
    totalPages: data.data.meta.totalPages,
  }
}

export async function getAdminById(id: string): Promise<Admin> {
  const { data } = await apiClient.get<ApiResponse<Admin>>(
    API_ENDPOINTS.USERS.DETAILS(id),
  )
  return data.data
}

export async function createAdmin(payload: CreateAdminPayload): Promise<Admin> {
  const { data } = await apiClient.post<ApiResponse<Admin>>(
    API_ENDPOINTS.USERS.CREATE,
    payload,
  )
  return data.data
}

export async function updateAdmin(id: string, payload: UpdateAdminPayload): Promise<Admin> {
  const { data } = await apiClient.patch<ApiResponse<Admin>>(
    API_ENDPOINTS.USERS.UPDATE(id),
    payload,
  )
  return data.data
}

export async function updateAdminStatus(id: string, payload: UpdateAdminStatusPayload): Promise<Admin> {
  const { data } = await apiClient.patch<ApiResponse<Admin>>(
    API_ENDPOINTS.USERS.UPDATE_STATUS(id),
    payload,
  )
  return data.data
}

export async function deleteAdmin(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id))
}

export async function getAllUsers(params?: any): Promise<any[]> {
  const { data } = await apiClient.get<ApiResponse<any[]>>(
    API_ENDPOINTS.USERS.LIST,
    { params },
  )
  return data.data
}

export async function getStudents(params?: any): Promise<any[]> {
  const { data } = await apiClient.get<ApiResponse<any[]>>(
    API_ENDPOINTS.USERS.STUDENTS,
    { params },
  )
  return data.data
}

export async function getArtisans(params?: any): Promise<any[]> {
  const { data } = await apiClient.get<ApiResponse<any[]>>(
    API_ENDPOINTS.USERS.ARTISANS,
    { params },
  )
  return data.data
}
