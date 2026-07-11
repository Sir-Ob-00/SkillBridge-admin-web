import { createStatusBadge } from '@/components/common/StatusBadge'
import type { ReviewStatus } from '@/types/review.types'

export const ReviewStatusBadge = createStatusBadge<ReviewStatus>({
  variants: {
    visible: 'success',
    hidden: 'secondary',
    flagged: 'warning',
    removed: 'danger',
  },
  fallback: 'secondary',
})
