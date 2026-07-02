export type ReportStatus = 'open' | 'under_investigation' | 'pending_response' | 'resolved' | 'dismissed'

export type ReportPriority = 'low' | 'medium' | 'high' | 'critical'

export type ReportCategory =
  | 'inappropriate_behavior'
  | 'fraud_scam'
  | 'no_show'
  | 'harassment'
  | 'fake_profile'
  | 'poor_workmanship'
  | 'payment_dispute'
  | 'inappropriate_review'
  | 'safety_concern'
  | 'other'

export type ReporterType = 'student' | 'artisan'

export type EntityType = 'student' | 'artisan' | 'booking' | 'review'

export interface ReportEvidence {
  id: string
  type: 'image' | 'pdf' | 'video' | 'screenshot'
  url: string
  thumbnailUrl?: string
  fileName: string
  uploadedAt: string
  fileSize?: number
}

export interface ReportNote {
  id: string
  reportId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
  updatedAt?: string
  isInternal: boolean
}

export interface ReportTimeline {
  id: string
  reportId: string
  action: 'submitted' | 'assigned' | 'status_changed' | 'note_added' | 'resolved' | 'dismissed'
  performedBy: string
  performedAt: string
  notes?: string
  metadata?: Record<string, unknown>
}

export interface ReportedEntity {
  type: EntityType
  id: string
  name: string
  email?: string
  avatar?: string | null
  additionalInfo?: Record<string, unknown>
}

export interface Reporter {
  type: ReporterType
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string | null
}

export interface Report {
  id: string
  category: ReportCategory
  priority: ReportPriority
  status: ReportStatus
  title: string
  description: string
  reason?: string
  reporter: Reporter
  reportedEntity: ReportedEntity
  evidence: ReportEvidence[]
  notes: ReportNote[]
  timeline: ReportTimeline[]
  assignedAdmin?: string
  assignedAdminName?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolvedBy?: string
  dismissedAt?: string
  dismissedBy?: string
  dismissalReason?: string
}

export interface ReportFilters {
  search?: string
  status?: ReportStatus
  priority?: ReportPriority
  category?: ReportCategory
  reporterType?: ReporterType
  entityType?: EntityType
  assignedAdmin?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'newest' | 'oldest' | 'priority' | 'status' | 'last_updated'
  page?: number
  limit?: number
}

export interface ReportStatistics {
  totalReports: number
  openReports: number
  underInvestigation: number
  pendingResponse: number
  resolved: number
  dismissed: number
  criticalReports: number
  todayReports: number
}

export interface PaginatedReportResponse {
  data: Report[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UpdateReportStatusPayload {
  status: ReportStatus
  note?: string
}

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
