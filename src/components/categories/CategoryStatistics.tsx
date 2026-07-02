import { Card, CardContent } from '@/components/ui/card'
import { Users, Calendar, CheckCircle, XCircle, Star, DollarSign } from 'lucide-react'
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

  const stats = [
    {
      title: 'Total Artisans',
      value: statistics.totalArtisans,
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Active Artisans',
      value: statistics.activeArtisans,
      icon: CheckCircle,
      color: 'text-success',
    },
    {
      title: 'Bookings This Month',
      value: statistics.bookingsThisMonth,
      icon: Calendar,
      color: 'text-warning',
    },
    {
      title: 'Completed Bookings',
      value: statistics.completedBookings,
      icon: CheckCircle,
      color: 'text-success',
    },
    {
      title: 'Cancelled Bookings',
      value: statistics.cancelledBookings,
      icon: XCircle,
      color: 'text-danger',
    },
    {
      title: 'Average Rating',
      value: statistics.averageRating.toFixed(1),
      icon: Star,
      color: 'text-warning',
    },
  ]

  if (statistics.revenue !== undefined) {
    stats.push({
      title: 'Revenue',
      value: `$${statistics.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-success',
    })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Icon className={`size-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
