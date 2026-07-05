import { Badge } from '@/components/ui/badge'
import type { AdminStatus } from '@/types/admin.types'

interface AdminStatusBadgeProps {
  status: AdminStatus
}

function getVariant(status: AdminStatus) {
  return status === 'active' ? 'success' : 'secondary'
}

function getLabel(status: AdminStatus) {
  return status === 'active' ? 'Active' : 'Inactive'
}

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  return <Badge variant={getVariant(status)}>{getLabel(status)}</Badge>
}
