import type { PaginatedResponse } from '@/types/api.types'
export const AUDIT_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  EXPORT: 'export',
  APPROVE: 'approve',
  REJECT: 'reject',
  ASSIGN: 'assign',
  RESOLVE: 'resolve',
  DISMISS: 'dismiss',
  FLAG: 'flag',
  HIDE: 'hide',
  RESTORE: 'restore',
  VERIFY: 'verify',
  REQUEST_INFO: 'request_info',
  REORDER: 'reorder',
  STATUS_CHANGE: 'status_change',
  SETTINGS_UPDATE: 'settings_update',
} as const

export type AuditAction =
  (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS] | (string & {})

export const AUDIT_STATUSES = {
  SUCCESS: 'success',
  FAILED: 'failed',
  WARNING: 'warning',
  PENDING: 'pending',
  INFO: 'info',
} as const

export type AuditStatus =
  (typeof AUDIT_STATUSES)[keyof typeof AUDIT_STATUSES] | (string & {})

export interface AuditUser {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string | null
  role?: string | null
}

export interface AuditLog {
  id: string
  action: AuditAction
  administrator: AuditUser
  resource: string
  resourceId?: string | null
  status: AuditStatus
  timestamp: string
  ipAddress?: string | null
  userAgent?: string | null
  beforeValue?: Record<string, unknown> | unknown[] | string | number | boolean | null
  afterValue?: Record<string, unknown> | unknown[] | string | number | boolean | null
  payload?: Record<string, unknown> | unknown[] | string | number | boolean | null
  metadata?: Record<string, unknown> | null
}

export interface AuditLogStatistics {
  totalLogs: number
  todaysLogs: number
  failedActions: number
  activeAdminsToday: number
}

export interface AuditFilters {
  page?: number
  limit?: number
  search?: string
  admin?: string
  action?: AuditAction
  dateFrom?: string
  dateTo?: string
}

export interface PaginatedAuditResponse extends PaginatedResponse<AuditLog> {
  statistics?: AuditLogStatistics
}
