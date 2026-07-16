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

/** Turns a snake/space status into a Title Cased label, e.g. `UNDER_REVIEW` -> `Under Review`. */
export function formatStatusLabel(status: string): string {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

interface StatusBadgeConfig<T extends string> {
  /** Maps a (normalized) status value to a visual variant. */
  variants: Partial<Record<string, StatusVariant>>
  /** Variant used when a status has no explicit mapping. */
  fallback?: StatusVariant
  /** Formats the displayed label. Defaults to the raw status value. */
  formatLabel?: (status: T) => string
  /** Normalizes a status before variant lookup (e.g. lowercasing). */
  normalizeKey?: (status: T) => string
}

/**
 * Builds a domain-specific status badge from a declarative config, removing the
 * repeated switch/interface boilerplate each badge used to carry.
 */
export function createStatusBadge<T extends string>({
  variants,
  fallback = 'secondary',
  formatLabel = (status) => String(status),
  normalizeKey = (status) => String(status),
}: StatusBadgeConfig<T>) {
  return function DomainStatusBadge({ status }: { status: T }) {
    const variant = variants[normalizeKey(status)] ?? fallback
    return <StatusBadge status={formatLabel(status)} variant={variant} />
  }
}
