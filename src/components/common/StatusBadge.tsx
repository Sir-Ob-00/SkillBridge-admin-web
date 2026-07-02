import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { StatusVariant } from '@/types/common.types'

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: string
  variant?: StatusVariant
}

const statusVariantMap: Record<StatusVariant, BadgeProps['variant']> = {
  default: 'default',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  secondary: 'secondary',
  outline: 'outline',
}

export function StatusBadge({
  status,
  variant = 'default',
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge
      variant={statusVariantMap[variant]}
      className={className}
      {...props}
    >
      {status}
    </Badge>
  )
}
