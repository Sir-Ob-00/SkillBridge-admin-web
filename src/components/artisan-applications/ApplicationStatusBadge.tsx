import { createStatusBadge, formatStatusLabel } from '@/components/common/StatusBadge'
import type { ApplicationStatus } from '@/types/artisanApplication.types'

export const ApplicationStatusBadge = createStatusBadge<ApplicationStatus>({
  variants: {
    approved: 'success',
    rejected: 'danger',
    under_review: 'warning',
    changes_requested: 'secondary',
  },
  fallback: 'outline',
  formatLabel: formatStatusLabel,
})
