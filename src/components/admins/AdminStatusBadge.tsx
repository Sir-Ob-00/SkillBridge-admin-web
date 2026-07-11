import { createStatusBadge, formatStatusLabel } from '@/components/common/StatusBadge'
import type { AdminStatus } from '@/types/admin.types'

export const AdminStatusBadge = createStatusBadge<AdminStatus>({
  variants: { active: 'success', inactive: 'secondary' },
  fallback: 'secondary',
  formatLabel: formatStatusLabel,
})
