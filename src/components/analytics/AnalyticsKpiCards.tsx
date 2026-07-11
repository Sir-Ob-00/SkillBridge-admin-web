import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardAnalytics } from '@/types/analytics.types'
import { Users, Calendar, DollarSign, ShieldCheck, Briefcase } from 'lucide-react'

interface AnalyticsKpiCardsProps {
  metrics: DashboardAnalytics | null
  isLoading: boolean
}

export function AnalyticsKpiCards({ metrics, isLoading }: AnalyticsKpiCardsProps) {
  const kpiCards = [
    { title: 'Total Users', value: metrics?.totalUsers ?? 0, icon: Users },
    { title: 'Total Students', value: metrics?.totalStudents ?? 0, icon: Users },
    { title: 'Total Artisans', value: metrics?.totalArtisans ?? 0, icon: Briefcase },
    { title: 'Pending Verifications', value: metrics?.pendingVerifications ?? 0, icon: ShieldCheck },
    { title: 'Total Bookings', value: metrics?.totalBookings ?? 0, icon: Calendar },
    {
      title: 'Total Revenue',
      value: metrics?.totalRevenue ?? 0,
      icon: DollarSign,
      format: 'currency' as const,
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
        const formattedValue =
          card.format === 'currency' ? `$${(card.value as number).toLocaleString()}` : (card.value as number).toLocaleString()

        return (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{formattedValue}</p>
                </div>
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
