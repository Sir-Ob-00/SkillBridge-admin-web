import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { OverviewMetrics } from '@/types/analytics.types'
import { Users, Calendar, DollarSign, Star, AlertTriangle, TrendingUp } from 'lucide-react'

interface AnalyticsKpiCardsProps {
  metrics: OverviewMetrics | null
  isLoading: boolean
}

export function AnalyticsKpiCards({ metrics, isLoading }: AnalyticsKpiCardsProps) {
  const kpiCards = [
    {
      title: 'Total Users',
      value: metrics?.totalUsers || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Bookings',
      value: metrics?.totalBookings || 0,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Revenue',
      value: metrics?.totalRevenue || 0,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      format: 'currency',
    },
    {
      title: 'Average Rating',
      value: metrics?.averageRating || 0,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      format: 'rating',
    },
    {
      title: 'Total Reports',
      value: metrics?.totalReports || 0,
      icon: AlertTriangle,
      color: 'text-danger',
      bgColor: 'bg-danger/10',
    },
    {
      title: 'Growth Rate',
      value: metrics?.growthRate || 0,
      icon: TrendingUp,
      color: metrics?.growthRate && metrics.growthRate >= 0 ? 'text-success' : 'text-danger',
      bgColor: metrics?.growthRate && metrics.growthRate >= 0 ? 'bg-success/10' : 'bg-danger/10',
      format: 'percentage',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiCards.map((card) => {
        const Icon = card.icon
        const formattedValue = card.format === 'currency'
          ? `$${card.value.toLocaleString()}`
          : card.format === 'percentage'
          ? `${card.value.toFixed(1)}%`
          : card.format === 'rating'
          ? card.value.toFixed(1)
          : card.value.toLocaleString()

        return (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{formattedValue}</p>
                </div>
                <div className={`size-10 rounded-full ${card.bgColor} flex items-center justify-center ${card.color}`}>
                  <Icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
