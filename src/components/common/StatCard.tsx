import { type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatCardVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange' | 'cyan'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: string
    positive?: boolean
  }
  variant?: StatCardVariant
  className?: string
}

const variantStyles: Record<StatCardVariant, { border: string; iconBg: string; iconColor: string }> = {
  primary: {
    border: 'border-l-4 border-l-primary',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  secondary: {
    border: 'border-l-4 border-l-secondary',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
  },
  success: {
    border: 'border-l-4 border-l-success',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
  warning: {
    border: 'border-l-4 border-l-warning',
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
  },
  danger: {
    border: 'border-l-4 border-l-danger',
    iconBg: 'bg-danger/10',
    iconColor: 'text-danger',
  },
  info: {
    border: 'border-l-4 border-l-blue-500',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  purple: {
    border: 'border-l-4 border-l-purple-500',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
  orange: {
    border: 'border-l-4 border-l-orange-500',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
  cyan: {
    border: 'border-l-4 border-l-cyan-500',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
  },
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'primary',
  className,
}: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card className={cn('transition-all hover:shadow-md', styles.border, className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn('flex size-9 items-center justify-center rounded-lg', styles.iconBg)}>
            <Icon className={cn('size-4', styles.iconColor)} aria-hidden="true" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="mt-1 text-xs text-muted-foreground">
            {trend && (
              <span
                className={cn(
                  'mr-1 font-medium',
                  trend.positive ? 'text-success' : 'text-danger',
                )}
              >
                {trend.value}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
