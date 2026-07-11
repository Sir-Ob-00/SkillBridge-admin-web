import { API_ENDPOINTS } from '@/constants/api-endpoints'
import { emptyPage, type ApiResponse } from '@/types/api.types'
import type {
  Report,
  ReportFilters,
  PaginatedReportResponse,
  AssignReportPayload,
  ResolveReportPayload,
  DismissReportPayload,
  AddReportNotePayload,
  ReportStatistics,
} from '@/types/report.types'
import apiClient from '@/api/axios'

export async function getReports(
  params?: ReportFilters,
): Promise<PaginatedReportResponse> {
  const { data } = await apiClient.get<ApiResponse<PaginatedReportResponse>>(
    API_ENDPOINTS.REPORTS.LIST,
    { params },
  )
  return data.data ?? emptyPage<Report>()
}

export async function getReportById(id: string): Promise<Report> {
  const { data } = await apiClient.get<ApiResponse<Report>>(
    API_ENDPOINTS.REPORTS.DETAILS(id),
  )
  return data.data
}

export async function assignReport(
  id: string,
  payload: AssignReportPayload,
): Promise<Report> {
  const { data } = await apiClient.patch<ApiResponse<Report>>(
    API_ENDPOINTS.REPORTS.ASSIGN(id),
    payload,
  )
  return data.data
}

export async function resolveReport(
  id: string,
  payload: ResolveReportPayload,
): Promise<Report> {
  const { data } = await apiClient.patch<ApiResponse<Report>>(
    API_ENDPOINTS.REPORTS.RESOLVE(id),
    payload,
  )
  return data.data
}

export async function dismissReport(
  id: string,
  payload: DismissReportPayload,
): Promise<Report> {
  const { data } = await apiClient.patch<ApiResponse<Report>>(
    API_ENDPOINTS.REPORTS.DISMISS(id),
    payload,
  )
  return data.data
}

export async function addReportNote(
  id: string,
  payload: AddReportNotePayload,
): Promise<Report> {
  const { data } = await apiClient.post<ApiResponse<Report>>(
    API_ENDPOINTS.REPORTS.ADD_NOTE(id),
    payload,
  )
  return data.data
}

export async function getReportStatistics(): Promise<ReportStatistics> {
  const { data } = await apiClient.get<ApiResponse<ReportStatistics>>(
    API_ENDPOINTS.REPORTS.STATISTICS,
  )
  return data.data
}
