import { createStatusBadge } from '@/components/common/StatusBadge'
import type { BookingStatus } from '@/types/booking.types'

export const BookingStatusBadge = createStatusBadge<BookingStatus>({
  variants: {
    completed: 'success',
    cancelled: 'secondary',
    disputed: 'danger',
    in_progress: 'secondary',
    accepted: 'secondary',
    rejected: 'danger',
    pending: 'warning',
  },
  fallback: 'secondary',
})
