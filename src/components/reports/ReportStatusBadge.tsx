import { StatusBadge } from '@/components/common/StatusBadge'
import type { ReportStatus } from '@/types/report.types'

interface ReportStatusBadgeProps {
  status: ReportStatus
}

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  const getVariant = (): 'success' | 'warning' | 'danger' | 'secondary' => {
    switch (status) {
      case 'resolved':
        return 'success'
      case 'dismissed':
        return 'secondary'
      case 'under_investigation':
        return 'secondary'
      case 'pending_response':
        return 'secondary'
      case 'open':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  return <StatusBadge status={status.replace('_', ' ')} variant={getVariant()} />
}
