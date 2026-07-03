export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'approve'
  | 'reject'
  | 'activate'
  | 'deactivate'
  | 'login'
  | 'logout'
  | 'export'
  | 'import'

export type AuditStatus = 'success' | 'failed' | 'pending'

export interface AuditUser {
  id: string
  name: string
  email: string
  role: string
}

export interface AuditLog {
  id: string
  action: AuditAction
  resource: string
  resourceId?: string
  user: AuditUser
  status: AuditStatus
  ipAddress: string
  userAgent: string
  beforeValue?: any
  afterValue?: any
  metadata?: Record<string, any>
  createdAt: string
}

export interface AuditFilters {
  search?: string
  adminId?: string
  action?: AuditAction
  status?: AuditStatus
  dateFrom?: string
  dateTo?: string
}

export interface PaginatedAuditResponse {
  data: AuditLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AuditLogStatistics {
  totalLogs: number
  todayLogs: number
  failedActions: number
  activeAdminsToday: number
}
