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
  FileCheck,
  FolderTree,
  Flag,
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
import { getApplicationStatistics } from '@/services/artisanApplications.service'
import {
  getDashboardStatistics,
  getRecentActivities,
} from '@/services/dashboard.service'
import type { ApplicationStatistics } from '@/types/artisanApplication.types'
import type {
  CategoryUsage,
  DashboardActivityLog,
  RecentActivityItem,
} from '@/types/dashboard.types'
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

function formatActivityMessage(log: DashboardActivityLog): string {
  const action = (log.action ?? '').replace(/_/g, ' ').trim().toLowerCase()
  const resource = (log.resource ?? '').replace(/_/g, ' ').trim().toLowerCase()
  const text = [action, resource].filter(Boolean).join(' ')
  if (!text) return 'Activity recorded'
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export default function Dashboard() {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard', 'statistics'],
    queryFn: getDashboardStatistics,
  })

  const { data: recentActivities } = useQuery({
    queryKey: ['dashboard', 'recent-activities'],
    queryFn: () => getRecentActivities(15),
  })

  const { data: applicationStats } = useQuery<ApplicationStatistics>({
    queryKey: ['application-statistics'],
    queryFn: getApplicationStatistics,
  })

  const kpiCards = useMemo(() => {
    if (!stats) return []

    const bookingsByStatus = stats.bookingsByStatus
    const ratings = stats.ratings

    return [
      // Users
      { title: 'Total Users', value: stats.totalUsers ?? 0, icon: Users, variant: 'primary' as const },
      { title: 'Total Students', value: stats.totalStudents ?? 0, icon: Users, variant: 'info' as const },
      { title: 'Total Artisans', value: stats.totalArtisans ?? 0, icon: Wrench, variant: 'purple' as const },
      { title: 'Total Admins', value: stats.totalAdmins ?? 0, icon: ShieldCheck, variant: 'secondary' as const },
      // Bookings
      { title: 'Total Bookings', value: stats.totalBookings ?? 0, icon: BookOpen, variant: 'cyan' as const },
      { title: 'Active Bookings', value: stats.activeBookings ?? 0, icon: BookOpen, variant: 'success' as const },
      { title: 'Pending Bookings', value: bookingsByStatus?.pending ?? 0, icon: BookOpen, variant: 'warning' as const },
      { title: 'Completed Bookings', value: stats.completedBookings ?? 0, icon: BookOpen, variant: 'info' as const },
      { title: 'Cancelled Bookings', value: stats.cancelledBookings ?? 0, icon: BookOpen, variant: 'danger' as const },
      // Platform
      { title: 'Pending Verifications', value: stats.pendingVerifications ?? 0, icon: ShieldCheck, variant: 'orange' as const },
      { title: 'Total Reviews', value: stats.totalReviews ?? 0, icon: Star, variant: 'warning' as const },
      { title: 'Total Reports', value: stats.totalReports ?? 0, icon: Flag, variant: 'danger' as const },
      { title: 'Total Categories', value: stats.totalCategories ?? 0, icon: FolderTree, variant: 'purple' as const },
      // Revenue & ratings
      {
        title: 'Total Revenue',
        value: `$${(stats.revenue ?? 0).toLocaleString()}`,
        icon: DollarSign,
        variant: 'success' as const,
      },
      {
        title: 'Average Rating',
        value: (ratings?.overallAverage ?? 0).toFixed(1),
        icon: TrendingUp,
        variant: 'cyan' as const,
      },
      // Artisan Applications (separate endpoint; skipped if unavailable)
      ...(applicationStats
        ? [
            { title: 'Pending Applications', value: applicationStats.pending ?? 0, icon: FileCheck, variant: 'warning' as const },
            { title: 'Under Review', value: applicationStats.underReview ?? 0, icon: FileCheck, variant: 'info' as const },
            { title: 'Approved Applications', value: applicationStats.approved ?? 0, icon: FileCheck, variant: 'success' as const },
            { title: 'Changes Requested', value: applicationStats.changesRequested ?? 0, icon: FileCheck, variant: 'orange' as const },
          ]
        : []),
    ]
  }, [stats, applicationStats])

  const bookingTrendsData = useMemo(() => {
    if (!stats) return []
    // Placeholder trend until a time-series endpoint exists.
    return [
      { name: 'Mon', bookings: 12 },
      { name: 'Tue', bookings: 19 },
      { name: 'Wed', bookings: 15 },
      { name: 'Thu', bookings: 22 },
      { name: 'Fri', bookings: 28 },
      { name: 'Sat', bookings: 35 },
      { name: 'Sun', bookings: 25 },
    ]
  }, [stats])

  const revenueData = useMemo(() => {
    if (!stats) return []
    const total = stats.revenue ?? 0
    return [
      { name: 'Week 1', revenue: total * 0.2 },
      { name: 'Week 2', revenue: total * 0.25 },
      { name: 'Week 3', revenue: total * 0.3 },
      { name: 'Week 4', revenue: total * 0.25 },
    ]
  }, [stats])

  const topCategories = useMemo<CategoryUsage[]>(() => {
    return (stats?.topCategories ?? []).map((cat) => ({
      name: cat.category,
      count: cat.count,
    }))
  }, [stats])

  const categoryDistributionData = useMemo(() => {
    return topCategories.map((cat, index) => ({
      name: cat.name,
      value: cat.count,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))
  }, [topCategories])

  const activities = useMemo<RecentActivityItem[]>(() => {
    return (recentActivities ?? []).map((log) => ({
      id: log.id,
      type: (log.action ?? 'default').toLowerCase(),
      message: formatActivityMessage(log),
      createdAt: log.createdAt,
    }))
  }, [recentActivities])

  const topArtisans = stats?.ratings?.topRated ?? []

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
                variant={card.variant}
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
        <RecentActivity activities={activities} isLoading={isLoading} />
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Top Artisans */}
        <TopArtisans artisans={topArtisans} isLoading={isLoading} />

        {/* Top Categories */}
        <TopCategories categories={topCategories} isLoading={isLoading} />
      </div>

      {/* Empty State */}
      {!isLoading && !stats && (
        <EmptyState
          title="No dashboard data available"
          description="Start using the platform to see your dashboard statistics."
          icon={<TrendingUp className="size-8" />}
        />
      )}
    </PageContainer>
  )
}
