import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  Wrench,
  BookOpen,
  DollarSign,
  ShieldCheck,
  Star,
  TrendingUp,
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { TopArtisans } from '@/components/dashboard/TopArtisans'
import { TopCategories } from '@/components/dashboard/TopCategories'
import { getDashboardOverview } from '@/services/dashboard.service'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { colors } from '@/theme/colors'

const CHART_COLORS = [
  colors.primary,
  colors.secondary,
  colors.success,
  colors.warning,
  colors.danger,
]

export default function Dashboard() {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardOverview,
  })

  const kpiCards = useMemo(() => {
    if (!dashboardData) return []

    return [
      // Users
      {
        title: 'Total Students',
        value: dashboardData.users.students,
        icon: Users,
        variant: 'info' as const,
      },
      {
        title: 'Total Artisans',
        value: dashboardData.users.artisans,
        icon: Wrench,
        variant: 'info' as const,
      },
      {
        title: 'Total Admins',
        value: dashboardData.users.admins,
        icon: ShieldCheck,
        variant: 'info' as const,
      },
      // Bookings
      {
        title: 'Total Bookings',
        value: dashboardData.bookings.total,
        icon: BookOpen,
        variant: 'info' as const,
      },
      {
        title: 'Pending Bookings',
        value: dashboardData.bookings.pending,
        icon: BookOpen,
        variant: 'warning' as const,
      },
      {
        title: 'Completed Bookings',
        value: dashboardData.bookings.completed,
        icon: BookOpen,
        variant: 'success' as const,
      },
      {
        title: 'Cancelled Bookings',
        value: dashboardData.bookings.cancelled,
        icon: BookOpen,
        variant: 'danger' as const,
      },
      // Revenue
      {
        title: 'Today Revenue',
        value: `$${dashboardData.revenue.today.toLocaleString()}`,
        icon: DollarSign,
        variant: 'success' as const,
      },
      {
        title: 'Monthly Revenue',
        value: `$${dashboardData.revenue.monthly.toLocaleString()}`,
        icon: DollarSign,
        variant: 'success' as const,
      },
      {
        title: 'Total Revenue',
        value: `$${dashboardData.revenue.total.toLocaleString()}`,
        icon: TrendingUp,
        variant: 'success' as const,
      },
      // Verification
      {
        title: 'Pending Verification',
        value: dashboardData.verification.pending,
        icon: ShieldCheck,
        variant: 'warning' as const,
      },
      {
        title: 'Approved Verification',
        value: dashboardData.verification.approved,
        icon: ShieldCheck,
        variant: 'success' as const,
      },
      {
        title: 'Rejected Verification',
        value: dashboardData.verification.rejected,
        icon: ShieldCheck,
        variant: 'danger' as const,
      },
      // Ratings
      {
        title: 'Average Rating',
        value: dashboardData.ratings.average.toFixed(1),
        icon: Star,
        variant: 'warning' as const,
      },
      {
        title: 'Total Reviews',
        value: dashboardData.ratings.totalReviews,
        icon: Star,
        variant: 'info' as const,
      },
    ]
  }, [dashboardData])

  const bookingTrendsData = useMemo(() => {
    if (!dashboardData) return []
    // This would normally come from the API
    // For now, we'll use placeholder data
    return [
      { name: 'Mon', bookings: 12 },
      { name: 'Tue', bookings: 19 },
      { name: 'Wed', bookings: 15 },
      { name: 'Thu', bookings: 22 },
      { name: 'Fri', bookings: 28 },
      { name: 'Sat', bookings: 35 },
      { name: 'Sun', bookings: 25 },
    ]
  }, [dashboardData])

  const revenueData = useMemo(() => {
    if (!dashboardData) return []
    // This would normally come from the API
    return [
      { name: 'Week 1', revenue: dashboardData.revenue.monthly * 0.2 },
      { name: 'Week 2', revenue: dashboardData.revenue.monthly * 0.25 },
      { name: 'Week 3', revenue: dashboardData.revenue.monthly * 0.3 },
      { name: 'Week 4', revenue: dashboardData.revenue.monthly * 0.25 },
    ]
  }, [dashboardData])

  const categoryDistributionData = useMemo(() => {
    if (!dashboardData) return []
    return dashboardData.topCategories.map((cat, index) => ({
      name: cat.name,
      value: cat.count,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))
  }, [dashboardData])

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="Overview of your SkillBridge platform activity."
        />
        <ErrorState
          title="Failed to load dashboard data"
          description="There was an error fetching the dashboard overview. Please try again."
          onRetry={() => refetch()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your SkillBridge platform activity."
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 15 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
            ))
          : kpiCards.map((card, index) => (
              <StatCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
              />
            ))}
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Booking Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bookingTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    stroke={colors.mutedForeground}
                  />
                  <YAxis className="text-xs" stroke={colors.mutedForeground} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.card,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke={colors.primary}
                    strokeWidth={2}
                    dot={{ fill: colors.primary }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    stroke={colors.mutedForeground}
                  />
                  <YAxis className="text-xs" stroke={colors.mutedForeground} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.card,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill={colors.success} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : categoryDistributionData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
                No category data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                    }
                    outerRadius={80}
                    fill={colors.primary}
                    dataKey="value"
                  >
                    {categoryDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.card,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity
          activities={dashboardData?.recentActivity ?? []}
          isLoading={isLoading}
        />
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Top Artisans */}
        <TopArtisans artisans={dashboardData?.topArtisans ?? []} isLoading={isLoading} />

        {/* Top Categories */}
        <TopCategories
          categories={dashboardData?.topCategories ?? []}
          isLoading={isLoading}
        />
      </div>

      {/* Empty State */}
      {!isLoading && !dashboardData && (
        <EmptyState
          title="No dashboard data available"
          description="Start using the platform to see your dashboard statistics."
          icon={<TrendingUp className="size-8" />}
        />
      )}
    </PageContainer>
  )
}
