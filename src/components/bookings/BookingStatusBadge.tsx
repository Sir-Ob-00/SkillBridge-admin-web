import { StatusBadge } from '@/components/common/StatusBadge'
import type { BookingStatus } from '@/types/booking.types'

interface BookingStatusBadgeProps {
  status: BookingStatus
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const getVariant = (): 'success' | 'warning' | 'danger' | 'secondary' => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'secondary'
      case 'disputed':
        return 'danger'
      case 'in_progress':
        return 'secondary'
      case 'accepted':
        return 'secondary'
      case 'rejected':
        return 'danger'
      case 'pending':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  return <StatusBadge status={status} variant={getVariant()} />
}
