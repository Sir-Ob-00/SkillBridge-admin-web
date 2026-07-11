import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AnalyticsKpiCards } from '@/components/analytics/AnalyticsKpiCards'
import { TopArtisansTable } from '@/components/analytics/TopArtisansTable'
import { getAnalyticsOverview } from '@/services/analytics.service'
import type { DateRange } from '@/types/analytics.types'
import { RefreshCw } from 'lucide-react'

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  const getAnalyticsParams = (range: DateRange) => {
    if (range === 'custom') return {}
    const days = parseInt(range.replace('d', ''))
    return { days }
  }

  const params = getAnalyticsParams(dateRange)

  const { data: overview, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics-overview', dateRange],
    queryFn: () => getAnalyticsOverview(params),
  })

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Analytics" description="Platform performance insights and trends." />
        <ErrorState
          title="Failed to load analytics"
          description="There was an error fetching the analytics data. Please try again."
          onRetry={() => refetch()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="Platform performance insights and trends."
        actions={
          <div className="flex gap-2">
            <div className="flex border border-border rounded-lg">
              {[
                { value: '7d' as DateRange, label: '7 Days' },
                { value: '30d' as DateRange, label: '30 Days' },
                { value: '90d' as DateRange, label: '90 Days' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={dateRange === option.value ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDateRange(option.value)}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`size-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6">
        <AnalyticsKpiCards metrics={overview ?? null} isLoading={isLoading} />
      </div>

      {/* Top Categories */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : overview && overview.topCategories.length > 0 ? (
              <div className="space-y-3">
                {overview.topCategories.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <span className="text-sm">{cat.category}</span>
                    <span className="text-sm font-medium">{cat.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Bookings by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : overview ? (
              <div className="space-y-3">
                {Object.entries(overview.bookingsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Rated Artisans */}
      <TopArtisansTable
        artisans={overview?.ratings.topRated ?? null}
        isLoading={isLoading}
      />
    </PageContainer>
  )
}
