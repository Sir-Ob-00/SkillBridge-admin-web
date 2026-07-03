import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  Admin,
  PaginatedAdminResponse,
  CreateAdminPayload,
  UpdateAdminPayload,
  UpdateAdminStatusPayload,
  AdminFilters,
} from '@/types/admin.types'
import apiClient from '@/api/axios'

export async function getAdmins(filters?: AdminFilters): Promise<PaginatedAdminResponse> {
  const { data } = await apiClient.get<ApiResponse<PaginatedAdminResponse>>(
    API_ENDPOINTS.ADMINS.LIST,
    { params: filters },
  )
  return data.data
}

export async function getAdminById(id: string): Promise<Admin> {
  const { data } = await apiClient.get<ApiResponse<Admin>>(
    API_ENDPOINTS.ADMINS.DETAILS(id),
  )
  return data.data
}

export async function createAdmin(payload: CreateAdminPayload): Promise<Admin> {
  const { data } = await apiClient.post<ApiResponse<Admin>>(
    API_ENDPOINTS.ADMINS.CREATE,
    payload,
  )
  return data.data
}

export async function updateAdmin(id: string, payload: UpdateAdminPayload): Promise<Admin> {
  const { data } = await apiClient.patch<ApiResponse<Admin>>(
    API_ENDPOINTS.ADMINS.UPDATE(id),
    payload,
  )
  return data.data
}

export async function updateAdminStatus(id: string, payload: UpdateAdminStatusPayload): Promise<Admin> {
  const { data } = await apiClient.patch<ApiResponse<Admin>>(
    API_ENDPOINTS.ADMINS.UPDATE_STATUS(id),
    payload,
  )
  return data.data
}

export async function deleteAdmin(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.ADMINS.DELETE(id))
}
