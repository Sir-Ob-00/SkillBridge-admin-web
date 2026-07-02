export type NotificationSeverity = 'info' | 'warning' | 'critical'

export type NotificationType = 'report' | 'review_flag' | 'verification' | 'booking' | 'system'

export interface AdminNotification {
  id: string
  type: NotificationType
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
