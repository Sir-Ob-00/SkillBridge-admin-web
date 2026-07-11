import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface StatTileItem {
  label: string
  value: string | number
  icon: LucideIcon
  /** Extra classes for the value text (e.g. a color). */
  valueClassName?: string
  /** Extra classes for the icon (e.g. a color). Defaults to the primary color. */
  iconClassName?: string
}

export function StatTile({
  label,
  value,
  icon: Icon,
  valueClassName,
  iconClassName,
}: StatTileItem) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={cn('text-2xl font-bold', valueClassName)}>{value}</p>
          </div>
          <Icon className={cn('size-8 text-primary', iconClassName)} />
        </div>
      </CardContent>
    </Card>
  )
}

interface StatTileGridProps {
  items: StatTileItem[]
  /** Override the default 4-column grid, e.g. `lg:grid-cols-3`. */
  className?: string
}

export function StatTileGrid({ items, className }: StatTileGridProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {items.map((item) => (
        <StatTile key={item.label} {...item} />
      ))}
    </div>
  )
}
