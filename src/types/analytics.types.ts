export type DateRange = '7d' | '30d' | '90d' | 'custom'

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

export interface CategoryData {
  name: string
  value: number
  count?: number
  color?: string
}

export interface OverviewMetrics {
  totalUsers: number
  totalBookings: number
  totalRevenue: number
  averageRating: number
  totalReports: number
  growthRate: number
}

export interface UserAnalytics {
  totalStudents: number
  totalArtisans: number
  newUsers: number
  activeUsers: number
  userGrowth: TimeSeriesData[]
}

export interface BookingAnalytics {
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  pendingBookings: number
  bookingTrend: TimeSeriesData[]
  statusDistribution: CategoryData[]
}

export interface RevenueAnalytics {
  totalRevenue: number
  revenueGrowth: number
  revenueTrend: TimeSeriesData[]
  revenueByCategory: CategoryData[]
  averageOrderValue: number
}

export interface CategoryAnalytics {
  topCategories: CategoryData[]
  categoryGrowth: TimeSeriesData[]
  totalCategories: number
}

export interface ReviewAnalytics {
  totalReviews: number
  averageRating: number
  ratingDistribution: CategoryData[]
  reviewTrend: TimeSeriesData[]
}

export interface ReportAnalytics {
  totalReports: number
  resolvedReports: number
  pendingReports: number
  reportTrend: TimeSeriesData[]
  reportByType: CategoryData[]
}

export interface TopArtisan {
  id: string
  name: string
  businessName: string
  avatar?: string | null
  totalBookings: number
  averageRating: number
  totalRevenue: number
}

export interface AnalyticsOverview {
  overview: OverviewMetrics
  users: UserAnalytics
  bookings: BookingAnalytics
  revenue: RevenueAnalytics
  categories: CategoryAnalytics
  reviews: ReviewAnalytics
  reports: ReportAnalytics
  topArtisans: TopArtisan[]
}
