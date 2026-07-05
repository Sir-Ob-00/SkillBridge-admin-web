import { StatusBadge } from '@/components/common/StatusBadge'
import { AUDIT_STATUSES, type AuditStatus } from '@/types/auditLog.types'

interface AuditLogStatusBadgeProps {
  status: AuditStatus
}

function formatStatusLabel(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function getVariant(status: string): 'success' | 'warning' | 'danger' | 'secondary' | 'outline' {
  switch (status.toLowerCase()) {
    case AUDIT_STATUSES.SUCCESS:
      return 'success'
    case AUDIT_STATUSES.FAILED:
      return 'danger'
    case AUDIT_STATUSES.WARNING:
      return 'warning'
    case AUDIT_STATUSES.PENDING:
      return 'secondary'
    case AUDIT_STATUSES.INFO:
      return 'outline'
    default:
      return 'outline'
  }
}

export function AuditLogStatusBadge({ status }: AuditLogStatusBadgeProps) {
  const label = formatStatusLabel(status)

  return <StatusBadge status={label} variant={getVariant(status)} />
}
