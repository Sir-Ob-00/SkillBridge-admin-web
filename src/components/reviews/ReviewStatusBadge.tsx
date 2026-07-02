import { StatusBadge } from '@/components/common/StatusBadge'
import type { ReviewStatus } from '@/types/review.types'

interface ReviewStatusBadgeProps {
  status: ReviewStatus
}

export function ReviewStatusBadge({ status }: ReviewStatusBadgeProps) {
  const getVariant = (): 'success' | 'warning' | 'danger' | 'secondary' => {
    switch (status) {
      case 'visible':
        return 'success'
      case 'hidden':
        return 'secondary'
      case 'flagged':
        return 'warning'
      case 'removed':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return <StatusBadge status={status} variant={getVariant()} />
}
