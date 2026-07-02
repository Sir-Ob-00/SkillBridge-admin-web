import type {
  AdminNotification,
  AdminActivityItem,
  ArtisanVerifiedPayload,
  ReportSubmittedPayload,
  ReviewFlaggedPayload,
  BookingCancelledPayload,
} from '@/types/notification.types'

export function mapEventToNotification(
  event: string,
  data: unknown,
): AdminNotification | null {
  const timestamp = new Date().toISOString()

  switch (event) {
    case 'artisan_verified': {
      const payload = data as ArtisanVerifiedPayload
      return {
        id: `${event}-${payload.artisanId}-${timestamp}`,
        type: 'verification',
        title: 'Artisan Verified',
        message: `${payload.artisanName} has been verified by ${payload.verifiedBy}`,
        severity: 'info',
        timestamp,
        data: payload,
      }
    }

    case 'report_submitted': {
      const payload = data as ReportSubmittedPayload
      return {
        id: `${event}-${payload.reportId}-${timestamp}`,
        type: 'report',
        title: 'New Report Submitted',
        message: `${payload.reporterName} submitted a report regarding ${payload.targetType}`,
        severity: 'critical',
        timestamp,
        data: payload,
      }
    }

    case 'review_flagged': {
      const payload = data as ReviewFlaggedPayload
      return {
        id: `${event}-${payload.reviewId}-${timestamp}`,
        type: 'review_flag',
        title: 'Review Flagged',
        message: `Review flagged by ${payload.flaggedBy}${payload.reason ? `: ${payload.reason}` : ''}`,
        severity: 'warning',
        timestamp,
        data: payload,
      }
    }

    case 'booking_cancelled': {
      const payload = data as BookingCancelledPayload
      return {
        id: `${event}-${payload.bookingId}-${timestamp}`,
        type: 'booking',
        title: 'Booking Cancelled',
        message: `Booking cancelled by ${payload.cancelledBy}${payload.reason ? `: ${payload.reason}` : ''}`,
        severity: 'info',
        timestamp,
        data: payload,
      }
    }

    default:
      return null
  }
}

export function mapEventToActivityItem(
  event: string,
  data: unknown,
): AdminActivityItem | null {
  const timestamp = new Date().toISOString()

  switch (event) {
    case 'artisan_verified': {
      const payload = data as ArtisanVerifiedPayload
      return {
        id: `${event}-${payload.artisanId}-${timestamp}`,
        type: 'verification',
        title: 'Artisan Verified',
        description: `${payload.artisanName} was verified by ${payload.verifiedBy}`,
        timestamp,
        data: payload,
      }
    }

    case 'report_submitted': {
      const payload = data as ReportSubmittedPayload
      return {
        id: `${event}-${payload.reportId}-${timestamp}`,
        type: 'report',
        title: 'Report Submitted',
        description: `${payload.reporterName} reported ${payload.targetType}`,
        timestamp,
        data: payload,
      }
    }

    case 'review_flagged': {
      const payload = data as ReviewFlaggedPayload
      return {
        id: `${event}-${payload.reviewId}-${timestamp}`,
        type: 'review_flag',
        title: 'Review Flagged',
        description: `Review flagged by ${payload.flaggedBy}`,
        timestamp,
        data: payload,
      }
    }

    case 'booking_cancelled': {
      const payload = data as BookingCancelledPayload
      return {
        id: `${event}-${payload.bookingId}-${timestamp}`,
        type: 'booking',
        title: 'Booking Cancelled',
        description: `Booking cancelled by ${payload.cancelledBy}`,
        timestamp,
        data: payload,
      }
    }

    default:
      return null
  }
}

export function deduplicateActivities(
  activities: AdminActivityItem[],
  newItem: AdminActivityItem,
  maxItems: number = 50,
): AdminActivityItem[] {
  // Check for duplicates (same event type and ID within last minute)
  const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
  const hasRecentDuplicate = activities.some(
    (item) =>
      item.type === newItem.type &&
      item.id === newItem.id &&
      item.timestamp > oneMinuteAgo,
  )

  if (hasRecentDuplicate) {
    return activities
  }

  // Add new item and keep only the most recent maxItems
  const updated = [newItem, ...activities]
  return updated.slice(0, maxItems)
}
