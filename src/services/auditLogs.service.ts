import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { AuditLog, PaginatedAuditResponse, AuditFilters } from '@/types/auditLog.types'
import apiClient from '@/api/axios'

export async function getAuditLogs(filters?: AuditFilters): Promise<PaginatedAuditResponse> {
  const { data } = await apiClient.get<ApiResponse<PaginatedAuditResponse>>(
    API_ENDPOINTS.AUDIT_LOGS.LIST,
    { params: filters },
  )
  return data.data
}

export async function getAuditLogById(id: string): Promise<AuditLog> {
  const { data } = await apiClient.get<ApiResponse<AuditLog>>(
    API_ENDPOINTS.AUDIT_LOGS.DETAILS(id),
  )
  return data.data
}

export async function exportAuditLogs(filters?: AuditFilters): Promise<Blob> {
  const { data } = await apiClient.get(
    API_ENDPOINTS.AUDIT_LOGS.EXPORT,
    {
      params: filters,
      responseType: 'blob',
    },
  )
  return data
}
