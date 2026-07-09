import { Badge } from '@/components/ui/badge'
import type { ApplicationStatus } from '@/types/artisanApplication.types'

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const getStatusVariant = (status: ApplicationStatus): 'success' | 'warning' | 'danger' | 'secondary' | 'outline' => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'rejected':
        return 'danger'
      case 'under_review':
        return 'warning'
      case 'changes_requested':
        return 'secondary'
      case 'pending':
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status: ApplicationStatus): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <Badge variant={getStatusVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}
