import { createStatusBadge } from '@/components/common/StatusBadge'
import type { ReportStatus } from '@/types/report.types'

export const ReportStatusBadge = createStatusBadge<ReportStatus>({
  variants: {
    resolved: 'success',
    dismissed: 'secondary',
    under_investigation: 'secondary',
    pending_response: 'secondary',
    open: 'warning',
  },
  fallback: 'secondary',
  formatLabel: (status) => status.replace('_', ' '),
})
