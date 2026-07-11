import { createStatusBadge, formatStatusLabel } from '@/components/common/StatusBadge'
import { AUDIT_STATUSES, type AuditStatus } from '@/types/auditLog.types'

export const AuditLogStatusBadge = createStatusBadge<AuditStatus>({
  variants: {
    [AUDIT_STATUSES.SUCCESS]: 'success',
    [AUDIT_STATUSES.FAILED]: 'danger',
    [AUDIT_STATUSES.WARNING]: 'warning',
    [AUDIT_STATUSES.PENDING]: 'secondary',
    [AUDIT_STATUSES.INFO]: 'outline',
  },
  fallback: 'outline',
  formatLabel: formatStatusLabel,
  normalizeKey: (status) => status.toLowerCase(),
})
