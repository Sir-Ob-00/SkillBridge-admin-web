import { Card, CardContent } from '@/components/ui/card'
import { Users, Calendar, CheckCircle, XCircle, Star, DollarSign } from 'lucide-react'
import { StatTileGrid, type StatTileItem } from '@/components/common/StatTile'
import type { CategoryStatistics } from '@/types/category.types'

interface CategoryStatisticsProps {
  statistics: CategoryStatistics
  isLoading?: boolean
}

export function CategoryStatistics({ statistics, isLoading = false }: CategoryStatisticsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const items: StatTileItem[] = [
    { label: 'Total Artisans', value: statistics.totalArtisans, icon: Users, iconClassName: 'text-primary' },
    { label: 'Active Artisans', value: statistics.activeArtisans, icon: CheckCircle, iconClassName: 'text-success' },
    { label: 'Bookings This Month', value: statistics.bookingsThisMonth, icon: Calendar, iconClassName: 'text-warning' },
    { label: 'Completed Bookings', value: statistics.completedBookings, icon: CheckCircle, iconClassName: 'text-success' },
    { label: 'Cancelled Bookings', value: statistics.cancelledBookings, icon: XCircle, iconClassName: 'text-danger' },
    { label: 'Average Rating', value: statistics.averageRating.toFixed(1), icon: Star, iconClassName: 'text-warning' },
  ]

  if (statistics.revenue !== undefined) {
    items.push({
      label: 'Revenue',
      value: `$${statistics.revenue.toLocaleString()}`,
      icon: DollarSign,
      iconClassName: 'text-success',
    })
  }

  return <StatTileGrid items={items} className="lg:grid-cols-3" />
}
