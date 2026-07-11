import type { Paginated } from '@/types/api.types'

export type NotificationType = 'info' | 'warning' | 'error' | 'success'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  targetUserId: string
  targetRole: string
  read: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface NotificationFilters {
  search?: string
  read?: boolean
  type?: NotificationType
  page?: number
  limit?: number
}

export interface NotificationStatistics {
  total: number
  unread: number
}

export type PaginatedNotificationResponse = Paginated<Notification>

export interface CreateNotificationPayload {
  title: string
  message: string
  type: NotificationType
  targetUserId?: string
  targetRole?: string
}

export interface BroadcastNotificationPayload {
  title: string
  message: string
  type: NotificationType
  targetRole?: string
}

export interface UpdateNotificationPayload {
  read?: boolean
  title?: string
  message?: string
  type?: NotificationType
}

// Legacy types for socket events and admin notifications
export type NotificationSeverity = 'info' | 'warning' | 'critical'

export type LegacyNotificationType = 'report' | 'review_flag' | 'verification' | 'booking' | 'system'

export interface AdminNotification {
  id: string
  type: LegacyNotificationType
  title: string
  message: string
  severity: NotificationSeverity
  timestamp: string
  data: unknown
}

export interface AdminActivityItem {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  data?: unknown
}

// Socket Event Payloads
export interface ArtisanVerifiedPayload {
  artisanId: string
  artisanName: string
  verifiedBy: string
  timestamp: string
}

export interface ReportSubmittedPayload {
  reportId: string
  reporterId: string
  reporterName: string
  targetType: 'user' | 'artisan' | 'booking' | 'review'
  targetId: string
  reason: string
  createdAt: string
}

export interface ReviewFlaggedPayload {
  reviewId: string
  artisanId: string
  rating: number
  comment: string
  flaggedBy: string
  reason?: string
  createdAt: string
}

export interface BookingCancelledPayload {
  bookingId: string
  cancelledBy: 'student' | 'artisan'
  artisanId: string
  studentId: string
  reason?: string
  timestamp: string
}
