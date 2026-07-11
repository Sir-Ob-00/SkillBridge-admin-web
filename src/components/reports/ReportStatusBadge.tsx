import { createStatusBadge } from '@/components/common/StatusBadge'
import type { ReportStatus } from '@/types/report.types'

export const ReportStatusBadge = createStatusBadge<ReportStatus>({
  variants: {
    open: 'warning',
    escalated: 'danger',
    resolved: 'success',
  },
  fallback: 'secondary',
})
