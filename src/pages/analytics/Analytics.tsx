import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { AnalyticsKpiCards } from '@/components/analytics/AnalyticsKpiCards'
import { UserGrowthChart } from '@/components/analytics/UserGrowthChart'
import { BookingTrendChart } from '@/components/analytics/BookingTrendChart'
import { RevenueChart } from '@/components/analytics/RevenueChart'
import { CategoryPieChart } from '@/components/analytics/CategoryPieChart'
import { TopArtisansTable } from '@/components/analytics/TopArtisansTable'
import {
  getOverview,
  getUserAnalytics,
  getBookingAnalytics,
  getRevenueAnalytics,
  getCategoryAnalytics,
} from '@/services/analytics.service'
import type { DateRange } from '@/types/analytics.types'
import { RefreshCw } from 'lucide-react'

export default function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  const { data: overview, isLoading: isLoadingOverview, error: overviewError, refetch: refetchOverview } = useQuery({
    queryKey: ['analytics-overview', dateRange],
    queryFn: () => getOverview(dateRange),
  })

  const { data: userAnalytics, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['analytics-users', dateRange],
    queryFn: () => getUserAnalytics(dateRange),
  })

  const { data: bookingAnalytics, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['analytics-bookings', dateRange],
    queryFn: () => getBookingAnalytics(dateRange),
  })

  const { data: revenueAnalytics, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['analytics-revenue', dateRange],
    queryFn: () => getRevenueAnalytics(dateRange),
  })

  const { data: categoryAnalytics, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['analytics-categories', dateRange],
    queryFn: () => getCategoryAnalytics(dateRange),
  })

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange)
  }

  const handleRefresh = () => {
    refetchOverview()
  }

  if (overviewError) {
    return (
      <PageContainer>
        <PageHeader
          title="Analytics"
          description="Platform performance insights and trends."
        />
        <ErrorState
          title="Failed to load analytics"
          description="There was an error fetching the analytics data. Please try again."
          onRetry={handleRefresh}
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
                  onClick={() => handleDateRangeChange(option.value)}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoadingOverview}
            >
              <RefreshCw className={`size-4 mr-2 ${isLoadingOverview ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6">
        <AnalyticsKpiCards metrics={overview || null} isLoading={isLoadingOverview} />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <UserGrowthChart data={userAnalytics?.userGrowth || null} isLoading={isLoadingUsers} />
        <BookingTrendChart data={bookingAnalytics?.bookingTrend || null} isLoading={isLoadingBookings} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <RevenueChart data={revenueAnalytics?.revenueTrend || null} isLoading={isLoadingRevenue} />
        <CategoryPieChart data={categoryAnalytics?.topCategories || null} isLoading={isLoadingCategories} />
      </div>

      {/* Top Artisans */}
      <div>
        <TopArtisansTable artisans={null} isLoading={isLoadingOverview} />
      </div>
    </PageContainer>
  )
}
