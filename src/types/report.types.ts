import type { Paginated } from '@/types/api.types'

export type ReportStatus = 'open' | 'resolved' | 'escalated'

export interface ReportReporter {
  id: string
  name: string
  email: string
  role: string
}

export interface ReportTarget {
  id: string
  name: string
  email: string
  role: string
}

export interface Report {
  id: string
  reporterId: string
  targetUserId: string
  reason: string
  details?: string | null
  status: ReportStatus
  assignedTo?: string | null
  resolution?: string | null
  closedAt?: string | null
  createdAt: string
  updatedAt: string
  reporter: ReportReporter
  target: ReportTarget
}

export interface ReportFilters {
  search?: string
  status?: ReportStatus
  page?: number
  limit?: number
}

export interface ReportStatistics {
  total: number
  open: number
  resolved: number
  escalated: number
}

export type PaginatedReportResponse = Paginated<Report>

export interface AssignReportPayload {
  adminId: string
  note?: string
}

export interface ResolveReportPayload {
  resolution: string
  internalNote?: string
}

export interface DismissReportPayload {
  reason: string
  internalNote?: string
}

export interface AddReportNotePayload {
  content: string
  isInternal: boolean
}

export interface UpdateReportStatusPayload {
  status: ReportStatus
}
