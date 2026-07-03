import { Badge } from '@/components/ui/badge'
import type { AdminStatus } from '@/types/admin.types'

interface AdminStatusBadgeProps {
  status: AdminStatus
}

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const variant = status === 'active' ? 'success' : 'secondary'
  return <Badge variant={variant}>{status}</Badge>
}
